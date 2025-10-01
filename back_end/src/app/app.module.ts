import { Module } from '@nestjs/common';
import { AuthModule } from '@app/auth/auth.module';
import { PrismaService } from '@root/prisma/prisma.service';
import { SpotifyService } from '@app/auth/services/spotify/spotify.service';
import { GoogleService } from '@app/auth/services/google/google.service';
import { ServiceController } from './services/services.controller';
import { AboutJsonController } from './aboutJson/aboutJson.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ZapsController } from './zaps/zaps.controller';
import { ZapsModule } from './zaps/zaps.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'assets'),
      serveRoot: '/assets',
    }),
    ZapsModule,
    ServicesModule,
  ],
  controllers: [ServiceController, AboutJsonController, ZapsController],
  providers: [PrismaService, SpotifyService, GoogleService],
})
export class AppModule {}
