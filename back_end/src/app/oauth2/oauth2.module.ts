import { Module } from '@nestjs/common';
import { OAuth2TokenController } from './oauth2-token.controller';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';
import { GmailStrategy } from '@app/oauth2/services/gmail/gmail.strategy';
import { GithubStrategy } from '@app/oauth2/services/github/github.strategy';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AuthModule } from '@app/auth/auth.module';
import { CryptoModule } from '@app/oauth2/crypto/crypto.module';
import { DiscordStrategy } from '@app/oauth2/services/discord/discord.strategy';
import { DiscordOAuth2Module } from '@app/oauth2/services/discord/discord.module';

@Module({
  imports: [CryptoModule, AuthModule, DiscordOAuth2Module],
  controllers: [OAuth2TokenController],
  providers: [
    PrismaService,
    ServicesService,
    ConnectionsService,
    GmailStrategy,
    GithubStrategy,
    DiscordStrategy,
  ],
})
export class Oauth2Module {}
