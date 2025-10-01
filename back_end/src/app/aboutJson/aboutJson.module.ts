import { Module } from '@nestjs/common';
import { AboutJsonController } from './aboutJson.controller';
import { AboutJsonService } from './aboutJson.service';
import { PrismaService } from '@root/prisma/prisma.service';

@Module({
  controllers: [AboutJsonController],
  providers: [AboutJsonService, PrismaService],
})
export class AboutJsonModule {}
