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
import { YoutubeOAuth2Module } from '@app/oauth2/services/youtube/youtube.module';
import { YoutubeStrategy } from '@app/oauth2/services/youtube/youtube.strategy';

@Module({
  imports: [AuthModule, DiscordOAuth2Module, GoogleCalendarOAuth2Module, YoutubeOAuth2Module],
  controllers: [OAuth2TokenController],
  providers: [
    PrismaService,
    ServicesService,
    ConnectionsService,
    DiscordStrategy,
    GoogleCalendarStrategy,
    YoutubeStrategy,
  ],
})
export class Oauth2Module {}
