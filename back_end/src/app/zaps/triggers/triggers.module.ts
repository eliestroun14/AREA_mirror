import { Module } from '@nestjs/common';
import { TriggersService } from './triggers.service';
import { PrismaService } from '@root/prisma/prisma.service';

@Module({
  providers: [PrismaService, TriggersService],
})
export class TriggersModule {}
