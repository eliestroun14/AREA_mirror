import { Module } from '@nestjs/common';
import { AboutJsonController } from './aboutJson.controller';
import { AboutJsonService } from './aboutJson.service';

@Module({
  controllers: [AboutJsonController],
  providers: [AboutJsonService],
})
export class AboutJsonModule {}
