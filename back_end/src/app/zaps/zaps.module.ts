import { Module } from '@nestjs/common';
import { ZapsService } from './zaps.service';
import { ZapsController } from './zaps.controller';

@Module({
  controllers: [ZapsController],
  providers: [ZapsService],
})
export class ZapsModule {}
