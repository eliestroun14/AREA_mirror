import { Module } from '@nestjs/common';
import { ZapsService } from './zaps.service';
import { ZapsController } from './zaps.controller';
import { PrismaService } from '@root/prisma/prisma.service';

@Module({
  controllers: [ZapsController],
  providers: [ZapsService, PrismaService],
})
export class ZapsModule {}
