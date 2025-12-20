import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AttackerController } from './attacker/attacker.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppController, AttackerController],
  providers: [AppService],
})
export class AppModule {}
