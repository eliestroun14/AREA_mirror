import { Module } from '@nestjs/common';
import { Oauth2Controller } from './oauth2.controller';
import { OAuth2TokenController } from './oauth2-token.controller';
import { Oauth2Service } from './oauth2.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';
import { GmailStrategy } from '@app/oauth2/services/gmail/gmail.strategy';
import { DiscordStrategy } from '@app/oauth2/services/discord/discord.strategy';
import { GithubStrategy } from '@app/oauth2/services/github/github.strategy';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AuthModule } from '@app/auth/auth.module';
import { CryptoModule } from '@app/oauth2/crypto/crypto.module';

@Module({
  imports: [CryptoModule, AuthModule],
  controllers: [Oauth2Controller, OAuth2TokenController],
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
