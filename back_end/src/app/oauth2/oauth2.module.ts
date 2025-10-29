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

@Module({
  imports: [AuthModule, DiscordOAuth2Module, TeamsOAuth2Module, GoogleCalendarOAuth2Module],
  controllers: [OAuth2TokenController],
  providers: [
    PrismaService,
    ServicesService,
    ConnectionsService,
    DiscordStrategy,
    TeamsStrategy,
    GoogleCalendarStrategy,
  ],
})
export class Oauth2Module {}
