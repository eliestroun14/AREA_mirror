import { Module } from '@nestjs/common';
import { OAuth2TokenController } from './oauth2-token.controller';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';
import { DiscordStrategy } from '@app/oauth2/services/discord/discord.strategy';
import { TeamsStrategy } from '@app/oauth2/services/teams/teams.strategy';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AuthModule } from '@app/auth/auth.module';
import { DiscordOAuth2Module } from '@app/oauth2/services/discord/discord.module';
import { TeamsOAuth2Module } from '@app/oauth2/services/teams/teams.module';
import { GoogleCalendarOAuth2Module } from '@app/oauth2/services/google-calendar/google-calendar.module';
import { GoogleCalendarStrategy } from '@app/oauth2/services/google-calendar/google-calendar.strategy';
import { TwitchOAuth2Module } from '@app/oauth2/services/twitch/twitch.module';
import { TwitchStrategy } from '@app/oauth2/services/twitch/twitch.strategy';
import { YoutubeOAuth2Module } from '@app/oauth2/services/youtube/youtube.module';
import { YoutubeStrategy } from '@app/oauth2/services/youtube/youtube.strategy';
import { DriveOAuth2Module } from '@app/oauth2/services/drive/drive.module';
import { DriveStrategy } from '@app/oauth2/services/drive/drive.strategy';
import { GithubStrategy } from '@root/services/github/oauth2/github.strategy';
import { GithubOAuth2Module } from '@root/services/github/oauth2/github.module';

@Module({
  imports: [
    AuthModule,
    DiscordOAuth2Module,
    TeamsOAuth2Module,
    GoogleCalendarOAuth2Module,
    YoutubeOAuth2Module,
    DriveOAuth2Module,
    TwitchOAuth2Module,
    GithubOAuth2Module,
  ],
  controllers: [OAuth2TokenController],
  providers: [
    PrismaService,
    ServicesService,
    ConnectionsService,
    DiscordStrategy,
    TeamsStrategy,
    GoogleCalendarStrategy,
    TwitchStrategy,
    YoutubeStrategy,
    DriveStrategy,
    GithubStrategy,
  ],
})
export class Oauth2Module {}
