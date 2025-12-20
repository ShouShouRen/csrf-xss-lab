import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req: { user: User }) {
    return req.user;
  }

  @Get('attacker/log')
  logStolenToken(@Query('token') token: string) {
    console.log('\n\n[Attacker] 😈 Stolen Token Captured:');
    console.log(token);
    console.log('----------------------------------------\n');
    return 'Token stolen successfully >:)';
  }
}
