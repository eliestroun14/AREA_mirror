import { Module } from '@nestjs/common';
import { OAuth2TokenController } from './oauth2-token.controller';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AuthModule } from '@app/auth/auth.module';
import { DiscordStrategy } from '@app/oauth2/services/discord/discord.strategy';
import { DiscordOAuth2Module } from '@app/oauth2/services/discord/discord.module';

@Module({
  imports: [AuthModule, DiscordOAuth2Module],
  controllers: [OAuth2TokenController],
  providers: [
    PrismaService,
    ServicesService,
    ConnectionsService,
    DiscordStrategy,
  ],
})
export class Oauth2Module {}
