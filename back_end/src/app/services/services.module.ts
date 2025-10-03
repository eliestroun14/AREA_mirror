import { Module } from '@nestjs/common';
import { ServiceController } from './services.controller';
import { ServicesService } from './services.service';
import { PrismaService } from '@root/prisma/prisma.service';

@Module({
  controllers: [ServiceController],
  providers: [ServicesService, PrismaService],
})
export class ServicesModule {}
