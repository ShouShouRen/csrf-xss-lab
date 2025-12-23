import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { SecureAuthService } from './secure-auth.service';

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private secureAuthService: SecureAuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // 1. 檢查 Cookie 中是否有 auth_token
    const authToken = request.cookies?.auth_token as string | undefined;
    if (!authToken) {
      throw new UnauthorizedException('Authentication required');
    }

    // 2. 驗證 JWT Token 是否有效
    const user = this.secureAuthService.verifyJwtToken(authToken);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // 3. 檢查 X-CSRF-Token Header
    const csrfToken = request.headers['x-csrf-token'] as string;
    if (!csrfToken) {
      throw new ForbiddenException('CSRF token is missing');
    }

    // 4. 驗證 CSRF Token
    const sessionId = this.secureAuthService.getSessionIdFromToken(authToken);
    const isValidCsrf = this.secureAuthService.validateCsrfToken(
      sessionId,
      csrfToken,
    );

    if (!isValidCsrf) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    // 將用戶資訊附加到 request 上供後續使用
    (request as any).user = user;

    return true;
  }
}
