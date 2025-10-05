import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  ScopeType,
  Strategy,
  StrategyOptions,
} from 'passport-discord-auth';
import { DiscordProvider } from '@app/oauth2/services/discord/discord.dto';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { services } from '@root/prisma/services-data/services.data';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  private static SCOPES: ScopeType = ['email', 'identify'];

  constructor() {
    const options: StrategyOptions = {
      clientId: envConstants.discord_client_id,
      clientSecret: envConstants.discord_client_secret,
      callbackUrl: callbackOf(services.discord.slug),
      scope: DiscordStrategy.SCOPES,
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): DiscordProvider {
    return {
      connection_name: services.discord.name,
      account_identifier: profile.id,
      email: profile.emails?.[0]?.value ?? 'none',
      username: profile.username ?? '',
      picture: profile.photos?.[0]?.value ?? '/assets/placeholder.png',
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: DiscordStrategy.SCOPES,
    };
  }
}
