import { Module } from '@nestjs/common';
import { ServiceController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  controllers: [ServiceController],
  providers: [ServicesService],
})
export class ServicesModule {}
