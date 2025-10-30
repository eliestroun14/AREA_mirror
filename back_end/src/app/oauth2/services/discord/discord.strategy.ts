import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  ScopeType,
  Strategy,
  StrategyOptions,
} from 'passport-discord-auth';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { constants } from '@config/utils';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  private static SCOPES: ScopeType = ['email', 'identify'];

  constructor() {
    const options: StrategyOptions = {
      clientId: envConstants.discord_client_id,
      clientSecret: envConstants.discord_client_secret,
      callbackUrl: callbackOf(constants.services.discord.slug),
      scope: DiscordStrategy.SCOPES,
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): OAuth2Provider {
    return {
      connection_name: constants.services.discord.name,
      account_identifier: profile.id,
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: DiscordStrategy.SCOPES,
    };
  }
}
