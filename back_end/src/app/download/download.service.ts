import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const access = promisify(fs.access);

@Injectable()
export class DownloadService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get the file path from environment variables
   * @returns The file path or null if not configured
   */
  getFilePath(): string | null {
    return this.configService.get<string>('DOWNLOAD_FILE_PATH') || null;
  }

  /**
   * Check if a file exists
   * @param filePath - The path to the file
   * @returns True if the file exists, false otherwise
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      await access(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Extract the filename from a path
   * @param filePath - The full file path
   * @returns The filename
   */
  getFileName(filePath: string): string {
    return path.basename(filePath);
  }

  /**
   * Get the MIME type based on file extension
   * @param fileName - The filename
   * @returns The MIME type
   */
  getMimeType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.apk': 'application/vnd.android.package-archive',
      '.txt': 'text/plain',
      '.pdf': 'application/pdf',
      '.zip': 'application/zip',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.csv': 'text/csv',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
}
