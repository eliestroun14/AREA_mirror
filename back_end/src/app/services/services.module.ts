import { Module } from '@nestjs/common';
import { ServiceController } from './services.controller';
import { ServicesService } from './services.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { TriggersService } from './triggers/triggers.service';
import { ActionsService } from './actions/actions.service';

@Module({
  controllers: [ServiceController],
  providers: [ServicesService, PrismaService, TriggersService, ActionsService],
})
export class ServicesModule {}
