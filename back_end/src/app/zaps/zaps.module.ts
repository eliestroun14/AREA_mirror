import { Module } from '@nestjs/common';
import { ZapsService } from './zaps.service';
import { ZapsController } from './zaps.controller';
import { PrismaService } from '@root/prisma/prisma.service';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { ServicesService } from '@app/services/services.service';
import { StepsService } from './steps/steps.service';

@Module({
  controllers: [ZapsController],
  providers: [
    ZapsService,
    ConnectionsService,
    ServicesService,
    PrismaService,
    StepsService,
  ],
})
export class ZapsModule {}
