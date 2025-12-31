import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SecureAuthController } from './secure-auth.controller';
import { SecureAuthService } from './secure-auth.service';
import { CsrfGuard } from './csrf.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'secure-secret-key',
      signOptions: { expiresIn: '3d' },
    }),
  ],
  controllers: [SecureAuthController],
  providers: [SecureAuthService, CsrfGuard],
  exports: [SecureAuthService],
})
export class SecureAuthModule {}
