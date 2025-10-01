import { Module } from '@nestjs/common';
import { AuthModule } from '@app/auth/auth.module';
import { PrismaService } from '@root/prisma/prisma.service';
import { SpotifyService } from '@app/auth/services/spotify/spotify.service';
import { GoogleService } from '@app/auth/services/google/google.service';
import { AboutJsonController } from './aboutJson/aboutJson.controller';
import { ZapsModule } from './zaps/zaps.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [AuthModule, ZapsModule, ServicesModule],
  controllers: [AboutJsonController],
  providers: [PrismaService, SpotifyService, GoogleService],
})
export class AppModule {}
