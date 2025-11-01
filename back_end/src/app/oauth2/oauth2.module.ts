import { Module } from '@nestjs/common';
import { OAuth2TokenController } from './oauth2-token.controller';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';
import { DiscordStrategy } from '@root/services/discord/oauth2/discord.strategy';
import { MicrosoftTeamsStrategy } from '@root/services/microsoft-teams/oauth2/microsoft-teams.strategy';
import { MicrosoftOnedriveStrategy } from '@root/services/microsoft-onedrive/oauth2/microsoft-onedrive.strategy';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AuthModule } from '@app/auth/auth.module';
import { DiscordOAuth2Module } from '@root/services/discord/oauth2/discord.module';
import { MicrosoftTeamsOAuth2Module } from '@root/services/microsoft-teams/oauth2/microsoft-teams.module';
import { MicrosoftOnedriveOAuth2Module } from '@root/services/microsoft-onedrive/oauth2/microsoft-onedrive.module';
import { GoogleCalendarOAuth2Module } from '@root/services/google-calendar/oauth2/google-calendar.module';
import { GoogleCalendarStrategy } from '@root/services/google-calendar/oauth2/google-calendar.strategy';
import { TwitchOAuth2Module } from '@root/services/twitch/oauth2/twitch.module';
import { TwitchStrategy } from '@root/services/twitch/oauth2/twitch.strategy';
import { YoutubeOAuth2Module } from '@root/services/youtube/oauth2/youtube.module';
import { YoutubeStrategy } from '@root/services/youtube/oauth2/youtube.strategy';
import { GoogleDriveOAuth2Module } from '@root/services/google-drive/oauth2/google-drive.module';
import { GoogleDriveStrategy } from '@root/services/google-drive/oauth2/google-drive.strategy';
import { GithubStrategy } from '@root/services/github/oauth2/github.strategy';
import { GithubOAuth2Module } from '@root/services/github/oauth2/github.module';

@Module({
  imports: [
    AuthModule,
    DiscordOAuth2Module,
    MicrosoftTeamsOAuth2Module,
    MicrosoftOnedriveOAuth2Module,
    GoogleCalendarOAuth2Module,
    YoutubeOAuth2Module,
    GoogleDriveOAuth2Module,
    TwitchOAuth2Module,
    GithubOAuth2Module,
  ],
  controllers: [OAuth2TokenController],
  providers: [
    PrismaService,
    ServicesService,
    ConnectionsService,
    DiscordStrategy,
    MicrosoftTeamsStrategy,
    MicrosoftOnedriveStrategy,
    GoogleCalendarStrategy,
    TwitchStrategy,
    YoutubeStrategy,
    GoogleDriveStrategy,
    GithubStrategy,
  ],
})
export class Oauth2Module {}
