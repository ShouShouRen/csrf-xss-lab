import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { SecureAuthService, User } from './secure-auth.service';
import { CsrfGuard } from './csrf.guard';

interface LoginDto {
  username: string;
  password: string;
}

interface TransferDto {
  amount: number;
  toAccount: string;
}

@Controller('secure-auth')
export class SecureAuthController {
  constructor(private secureAuthService: SecureAuthService) {}

  /**
   * 獲取匿名 CSRF Token（用於登入前的 CSRF 保護）
   * - 不需要認證
   * - 設置匿名 session ID 到 Cookie
   * - 返回 CSRF Token
   */
  @Get('anonymous-csrf-token')
  async getAnonymousCsrfToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // 檢查是否已有匿名 session ID
    let anonymousSessionId = request.cookies?.anonymous_session_id;

    if (!anonymousSessionId) {
      // 生成新的匿名 session ID
      anonymousSessionId =
        this.secureAuthService.generateAnonymousSessionId();

      // Cookie 安全設置
      const isProduction = process.env.NODE_ENV === 'production';
      const forceSecure = process.env.FORCE_SECURE_COOKIE === 'true';

      // 設置匿名 session ID Cookie（短期有效）
      response.cookie('anonymous_session_id', anonymousSessionId, {
        httpOnly: true,
        secure: isProduction || forceSecure,
        sameSite: 'lax',
        maxAge: 10 * 60 * 1000, // 10 分鐘
        path: '/',
      });
    }

    // 生成 CSRF Token
    const csrfToken =
      this.secureAuthService.generateCsrfToken(anonymousSessionId);

    console.log(
      `[Secure Auth] 匿名 CSRF Token 已生成: sessionId=${anonymousSessionId}`,
    );

    return { csrfToken };
  }

  /**
   * 登入 API
   * - 驗證 CSRF Token（防止登入 CSRF 攻擊）
   * - 驗證用戶憑證
   * - 設置 HttpOnly Cookie 存放 JWT Token
   * - 返回新的 CSRF Token 給前端
   */
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // 1. 驗證 CSRF Token（防止登入 CSRF 攻擊）
    const csrfToken = request.headers['x-csrf-token'] as string;
    const anonymousSessionId = request.cookies?.anonymous_session_id;

    if (!csrfToken || !anonymousSessionId) {
      throw new UnauthorizedException(
        'CSRF token is required for login. Please refresh the page.',
      );
    }

    // 驗證並消費匿名 CSRF Token
    const isValidCsrf =
      this.secureAuthService.validateAndConsumeAnonymousCsrfToken(
        anonymousSessionId,
        csrfToken,
      );

    if (!isValidCsrf) {
      throw new UnauthorizedException(
        'Invalid CSRF token. Please refresh the page and try again.',
      );
    }

    console.log(
      `[Secure Auth] ✅ 登入 CSRF Token 驗證成功: sessionId=${anonymousSessionId}`,
    );

    // 2. 驗證用戶憑證
    const user: User | null = await this.secureAuthService.validateUser(
      body.username,
      body.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. 生成 JWT Token
    const jwtToken = this.secureAuthService.generateJwtToken(user);

    // 4. 獲取 session ID 用於 CSRF Token 管理
    const sessionId = this.secureAuthService.getSessionIdFromToken(jwtToken);

    // 5. 生成新的 CSRF Token（用於後續的已登入操作）
    const newCsrfToken = this.secureAuthService.generateCsrfToken(sessionId);

    // Cookie 安全設置
    const isProduction = process.env.NODE_ENV === 'production';
    const forceSecure = process.env.FORCE_SECURE_COOKIE === 'true';

    // 6. 設置 HttpOnly Cookie（包含 JWT Token）
    response.cookie('auth_token', jwtToken, {
      httpOnly: true, // ✅ 防止 JavaScript 存取
      secure: isProduction || forceSecure, // ✅ HTTPS 環境下啟用
      sameSite: 'lax', // ✅ 防止跨站請求攜帶 Cookie
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 天
      path: '/',
    });

    // 7. 清除匿名 session ID Cookie
    response.clearCookie('anonymous_session_id', {
      httpOnly: true,
      secure: isProduction || forceSecure,
      sameSite: 'lax',
      path: '/',
    });

    console.log(
      `[Secure Auth] Cookie 設置: HttpOnly=true, Secure=${isProduction || forceSecure}, SameSite=lax`,
    );

    return {
      message: 'Login successful',
      csrfToken: newCsrfToken,
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

  /**
   * 獲取用戶資料
   * - 需要認證和 CSRF Token
   */
  @UseGuards(CsrfGuard)
  @Get('profile')
  async getProfile(@Req() request: Request) {
    const user = (request as any).user;
    return {
      userId: user.userId,
      username: user.username,
      email: `${user.username}@example.com`,
      balance: 10000,
      createdAt: '2024-01-01',
    };
  }

  /**
   * 模擬轉帳
   * - 需要認證和 CSRF Token（防止 CSRF 攻擊）
   */
  @UseGuards(CsrfGuard)
  @Post('transfer')
  async transfer(@Body() body: TransferDto, @Req() request: Request) {
    const user = (request as any).user;

    console.log(
      `[Secure Auth] ✅ 轉帳請求通過 CSRF 驗證: ${user.username} -> ${body.toAccount} ($${body.amount})`,
    );

    // 模擬轉帳邏輯
    return {
      message: 'Transfer successful',
      from: user.username,
      to: body.toAccount,
      amount: body.amount,
      timestamp: new Date().toISOString(),
    };
  }
}
