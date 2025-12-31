import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

export interface User {
  userId: number;
  username: string;
}

// 簡單的記憶體存儲 CSRF Token（生產環境應該使用 Redis 等）
const csrfTokenStore = new Map<string, string>();

@Injectable()
export class SecureAuthService {
  constructor(private jwtService: JwtService) {}

  validateUser(username: string, pass: string): Promise<User | null> {
    // 模擬用戶驗證（實際應用應該查詢資料庫）
    if (username === 'user' && pass === 'password') {
      return Promise.resolve({ userId: 1, username: 'user' });
    }
    return Promise.resolve(null);
  }

  // 生成 JWT Token
  generateJwtToken(user: User): string {
    const payload = { username: user.username, sub: user.userId };
    return this.jwtService.sign(payload);
  }

  // 驗證 JWT Token
  verifyJwtToken(token: string): User | null {
    try {
      const decoded = this.jwtService.verify(token);
      return { userId: decoded.sub, username: decoded.username };
    } catch {
      return null;
    }
  }

  // 生成 CSRF Token
  generateCsrfToken(sessionId: string): string {
    const csrfToken = crypto.randomBytes(32).toString('hex');
    csrfTokenStore.set(sessionId, csrfToken);
    return csrfToken;
  }

  // 驗證 CSRF Token
  validateCsrfToken(sessionId: string, csrfToken: string): boolean {
    const storedToken = csrfTokenStore.get(sessionId);
    return storedToken === csrfToken;
  }

  // 清除 CSRF Token（登出時使用）
  clearCsrfToken(sessionId: string): void {
    csrfTokenStore.delete(sessionId);
  }

  // 從 JWT Token 中提取 session ID（使用 JWT 本身作為 session 識別）
  getSessionIdFromToken(token: string): string {
    // 使用 token 的 hash 作為 session ID
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')
      .substring(0, 16);
  }

  // 生成匿名 session ID（用於登入前的 CSRF 保護）
  generateAnonymousSessionId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  // 驗證並消費匿名 CSRF Token（驗證後刪除，防止重放攻擊）
  validateAndConsumeAnonymousCsrfToken(
    anonymousSessionId: string,
    csrfToken: string,
  ): boolean {
    const storedToken = csrfTokenStore.get(anonymousSessionId);
    if (storedToken === csrfToken) {
      // 驗證成功後刪除匿名 token，防止重放攻擊
      csrfTokenStore.delete(anonymousSessionId);
      return true;
    }
    return false;
  }
}
