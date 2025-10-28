import { Module } from '@nestjs/common';
import { DiscordOAuth2Controller } from '@app/oauth2/services/discord/discord.controller';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';

@Module({
  imports: [],
  controllers: [DiscordOAuth2Controller],
  providers: [PrismaService, ConnectionsService, ServicesService],
})
export class DiscordOAuth2Module {}
