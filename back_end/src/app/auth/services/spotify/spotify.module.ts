import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { PrismaService } from '@root/prisma/prisma.service';

@Module({
  providers: [SpotifyService, PrismaService],
})
export class SpotifyModule {}
