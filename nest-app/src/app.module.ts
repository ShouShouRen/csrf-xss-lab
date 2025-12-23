import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AttackerController } from './attacker/attacker.controller';
import { SecureAuthModule } from './secure-auth/secure-auth.module';

@Module({
  imports: [AuthModule, SecureAuthModule],
  controllers: [AppController, AttackerController],
  providers: [AppService],
})
export class AppModule {}
