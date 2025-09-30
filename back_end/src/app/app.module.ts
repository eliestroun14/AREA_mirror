import { Module } from '@nestjs/common';
import { AuthModule } from '@app/auth/auth.module';
import { PrismaService } from '@root/prisma/prisma.service';
import { SpotifyService } from '@app/auth/services/spotify/spotify.service';
import { GoogleService } from '@app/auth/services/google/google.service';

@Module({
  imports: [AuthModule],
  providers: [PrismaService, SpotifyService, GoogleService],
})
export class AppModule {}
