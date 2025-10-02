import { Module } from '@nestjs/common';
import { ZapsService } from './zaps.service';
import { ZapsController } from './zaps.controller';
import { PrismaService } from '@root/prisma/prisma.service';
import { TriggersController } from './triggers/triggers.controller';
import { TriggersModule } from './triggers/triggers.module';
import { TriggersService } from '@app/zaps/triggers/triggers.service';

@Module({
  controllers: [ZapsController],
  providers: [ZapsService, TriggersService, PrismaService],
  imports: [TriggersModule],
})
export class ZapsModule {}
