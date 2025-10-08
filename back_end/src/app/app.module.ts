import { Module } from '@nestjs/common';
import { AuthModule } from '@app/auth/auth.module';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ZapsModule } from './zaps/zaps.module';
import { ServicesModule } from './services/services.module';
import { AboutJsonModule } from './aboutJson/aboutJson.module';
import { Oauth2Module } from './oauth2/oauth2.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { DownloadModule } from './download/download.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'assets'),
      serveRoot: '/assets',
    } as any),
    ZapsModule,
    ServicesModule,
    AboutJsonModule,
    Oauth2Module,
    WebhooksModule,
    DownloadModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
