import { Module } from '@nestjs/common';
import { ZapsService } from './zaps.service';
import { ZapsController } from './zaps.controller';
import { PrismaService } from '@root/prisma/prisma.service';
import { TriggersController } from './triggers/triggers.controller';
import { TriggersModule } from './triggers/triggers.module';

@Module({
  controllers: [ZapsController, TriggersController],
  providers: [ZapsService, PrismaService],
  imports: [TriggersModule],
})
export class ZapsModule {}

// ne pas oublier de mettre l'import du trigger et des actions
