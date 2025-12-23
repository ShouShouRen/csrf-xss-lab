import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { SecureAuthService, User } from './secure-auth.service';

interface LoginDto {
  username: string;
  password: string;
}

@Controller('secure-auth')
export class SecureAuthController {
  constructor(private secureAuthService: SecureAuthService) {}

  /**
   * 登入 API
   * - 驗證用戶憑證
   * - 設置 HttpOnly Cookie 存放 JWT Token
   * - 返回 CSRF Token 給前端
   */
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user: User | null = await this.secureAuthService.validateUser(
      body.username,
      body.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 生成 JWT Token
    const jwtToken = this.secureAuthService.generateJwtToken(user);

    // 獲取 session ID 用於 CSRF Token 管理
    const sessionId = this.secureAuthService.getSessionIdFromToken(jwtToken);

    // 生成 CSRF Token
    const csrfToken = this.secureAuthService.generateCsrfToken(sessionId);

    // Cookie 安全設置
    const isProduction = process.env.NODE_ENV === 'production';
    const forceSecure = process.env.FORCE_SECURE_COOKIE === 'true';

    // 設置 HttpOnly Cookie（包含 JWT Token）
    response.cookie('auth_token', jwtToken, {
      httpOnly: true, // ✅ 防止 JavaScript 存取
      secure: isProduction || forceSecure, // ✅ HTTPS 環境下啟用
      sameSite: 'lax', // ✅ 防止跨站請求攜帶 Cookie
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 天
      path: '/',
    });

    console.log(
      `[Secure Auth] Cookie 設置: HttpOnly=true, Secure=${isProduction || forceSecure}, SameSite=lax`,
    );

    return {
      message: 'Login successful',
      csrfToken,
      user: {
        userId: user.userId,
        username: user.username,
      },
    };
  }

  /**
   * 登出 API
   * - 清除 HttpOnly Cookie
   * - 清除 CSRF Token
   */
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authToken = request.cookies?.auth_token;

    if (authToken) {
      const sessionId = this.secureAuthService.getSessionIdFromToken(authToken);
      this.secureAuthService.clearCsrfToken(sessionId);
    }

    // Cookie 安全設置
    const isProduction = process.env.NODE_ENV === 'production';
    const forceSecure = process.env.FORCE_SECURE_COOKIE === 'true';

    // 清除 Cookie
    response.clearCookie('auth_token', {
      httpOnly: true,
      secure: isProduction || forceSecure,
      sameSite: 'lax',
      path: '/',
    });

    return { message: 'Logout successful' };
  }

  /**
   * 獲取 CSRF Token
   * - 需要已經登入（有效的 auth_token Cookie）
   * - 返回新的 CSRF Token
   */
  @Get('csrf-token')
  async getCsrfToken(@Req() request: Request) {
    const authToken = request.cookies?.auth_token;

    if (!authToken) {
      throw new UnauthorizedException('Not authenticated');
    }

    const user = this.secureAuthService.verifyJwtToken(authToken);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const sessionId = this.secureAuthService.getSessionIdFromToken(authToken);
    const csrfToken = this.secureAuthService.generateCsrfToken(sessionId);

    return { csrfToken };
  }

  /**
   * 檢查認證狀態
   * - 只驗證 Cookie，不需要 CSRF Token
   * - 用於頁面載入時檢查登入狀態
   */
  @Get('check')
  async checkAuth(@Req() request: Request) {
    const authToken = request.cookies?.auth_token;

    if (!authToken) {
      return { authenticated: false };
    }

    const user = this.secureAuthService.verifyJwtToken(authToken);
    if (!user) {
      return { authenticated: false };
    }

    return {
      authenticated: true,
      user: {
        userId: user.userId,
        username: user.username,
      },
    };
  }
}
