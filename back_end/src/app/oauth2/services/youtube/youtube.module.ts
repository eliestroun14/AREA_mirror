import { Module } from '@nestjs/common';
import { YoutubeOAuth2Controller } from '@app/oauth2/services/youtube/youtube.controller';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';

@Module({
  imports: [],
  controllers: [YoutubeOAuth2Controller],
  providers: [PrismaService, ConnectionsService, ServicesService],
})
export class YoutubeOAuth2Module {}
