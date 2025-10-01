import { Module } from '@nestjs/common';
import { AuthModule } from '@app/auth/auth.module';
import { PrismaService } from '@root/prisma/prisma.service';
import { SpotifyService } from '@app/auth/services/spotify/spotify.service';
import { GoogleService } from '@app/auth/services/google/google.service';
// import { AboutJsonController } from './aboutJson/aboutJson.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ZapsModule } from './zaps/zaps.module';
import { ServicesModule } from './services/services.module';
import { AboutJsonModule } from './aboutJson/aboutJson.module';

@Module({
  imports: [
    AuthModule,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'assets'),
      serveRoot: '/assets',
    } as any),
    ZapsModule,
    ServicesModule,
    AboutJsonModule,
  ],
  controllers: [],
  providers: [PrismaService, SpotifyService, GoogleService],
})
export class AppModule {}
