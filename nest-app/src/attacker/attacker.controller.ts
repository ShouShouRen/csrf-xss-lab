import { Controller, Get, Query, Logger } from '@nestjs/common';

@Controller('attacker')
export class AttackerController {
  private readonly logger = new Logger(AttackerController.name);

  @Get('collect')
  collect(@Query('token') token: string) {
    this.logger.warn(`[ATTACKER] Stolen Token: ${token}`);
    return { status: 'collected' };
  }
}
