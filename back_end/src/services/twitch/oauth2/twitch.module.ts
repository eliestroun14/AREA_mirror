import { Module } from '@nestjs/common';
import { TwitchOAuth2Controller } from '@root/services/twitch/oauth2/twitch.controller';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';

@Module({
  imports: [],
  controllers: [TwitchOAuth2Controller],
  providers: [PrismaService, ConnectionsService, ServicesService],
})
export class TwitchOAuth2Module {}
