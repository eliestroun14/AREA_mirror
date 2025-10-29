import { Module } from '@nestjs/common';
import { OAuth2TokenController } from './oauth2-token.controller';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AuthModule } from '@app/auth/auth.module';
import { DiscordStrategy } from '@app/oauth2/services/discord/discord.strategy';
import { DiscordOAuth2Module } from '@app/oauth2/services/discord/discord.module';
import { GoogleCalendarOAuth2Module } from '@app/oauth2/services/google-calendar/google-calendar.module';
import { GoogleCalendarStrategy } from '@app/oauth2/services/google-calendar/google-calendar.strategy';
import { GithubStrategy } from '@app/oauth2/services/github/github.strategy';
import { GithubOAuth2Module } from '@app/oauth2/services/github/github.module';

@Module({
  imports: [
    AuthModule,
    DiscordOAuth2Module,
    GithubOAuth2Module,
    GoogleCalendarOAuth2Module,
  ],
  controllers: [OAuth2TokenController],
  providers: [
    PrismaService,
    ServicesService,
    ConnectionsService,
    DiscordStrategy,
    GoogleCalendarStrategy,
    GithubStrategy,
  ],
})
export class Oauth2Module {}
