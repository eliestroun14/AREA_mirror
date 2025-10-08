import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DownloadController } from './download.controller';
import { DownloadService } from './download.service';

@Module({
  imports: [ConfigModule],
  controllers: [DownloadController],
  providers: [DownloadService],
})
export class DownloadModule {}
