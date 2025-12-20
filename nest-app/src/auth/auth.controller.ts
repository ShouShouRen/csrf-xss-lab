import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './auth.service';

interface LoginDto {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user: User | null = await this.authService.validateUser(
      body.username,
      body.password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.authService.login(user);
  }
}
