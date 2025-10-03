import { Module } from '@nestjs/common';
import { Oauth2Controller } from './oauth2.controller';
import { Oauth2Service } from './oauth2.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';
import { GmailStrategy } from '@app/oauth2/services/gmail/gmail.strategy';
import { DiscordStrategy } from '@app/oauth2/services/discord/discord.strategy';
import { GithubStrategy } from '@app/oauth2/services/github/github.strategy';
import { ConnectionsService } from '@app/users/connections/connections.service';

@Module({
  controllers: [Oauth2Controller],
  providers: [
    Oauth2Service,
    PrismaService,
    ServicesService,
    ConnectionsService,
    GmailStrategy,
    GithubStrategy,
    DiscordStrategy,
  ],
})
export class Oauth2Module {}
