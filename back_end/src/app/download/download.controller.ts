import {
  Controller,
  Get,
  Res,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { Response } from 'express';
import { DownloadService } from './download.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('download')
@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get('apk')
  @ApiOperation({ summary: 'Download the mobile application APK file' })
  @ApiResponse({ status: 200, description: 'File successfully downloaded' })
  @ApiResponse({ status: 404, description: 'File not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async downloadApk(@Res() res: Response): Promise<void> {
    try {
      const filePath = this.downloadService.getFilePath();

      if (!filePath) {
        throw new NotFoundException('Download file path not configured');
      }

      const fileExists = await this.downloadService.fileExists(filePath);

      if (!fileExists) {
        throw new NotFoundException('File not found');
      }

      const fileName = this.downloadService.getFileName(filePath);
      const mimeType = this.downloadService.getMimeType(fileName);

      res.setHeader('Content-Type', mimeType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );

      res.sendFile(filePath);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error downloading file');
    }
  }
}
