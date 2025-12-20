import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface User {
  userId: number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validateUser(username: string, pass: string): Promise<User | null> {
    if (username === 'user' && pass === 'password') {
      return Promise.resolve({ userId: 1, username: 'user' });
    }
    return Promise.resolve(null);
  }

  login(user: User) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
