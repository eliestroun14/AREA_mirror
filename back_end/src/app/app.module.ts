import { Module } from '@nestjs/common';
import { AuthModule } from '@app/auth/auth.module';
import { ConnectionModule } from './connection/connection.module';
import { JobService } from '@app/jobs/job.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { SpotifyService } from '@app/auth/services/spotify/spotify.service';
import { GoogleService } from '@app/auth/services/google/google.service';

@Module({
  imports: [AuthModule, ConnectionModule],
  providers: [JobService, PrismaService, SpotifyService, GoogleService],
})
export class AppModule {}
