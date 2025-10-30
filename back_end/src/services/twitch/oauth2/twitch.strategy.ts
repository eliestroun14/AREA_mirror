import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  TwitchProfile,
  // Strategy,
  StrategyOptions,
} from 'passport-twitch';
import { DoneCallback, Strategy, Scope } from '@hewmen/passport-twitch';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { constants } from '@config/utils';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

@Injectable()
export class TwitchStrategy extends PassportStrategy(
  Strategy,
  constants.services.twitch.slug,
) {
  private static SCOPES: Scope[] = [Scope.UserReadEmail];

  constructor() {
    const options: StrategyOptions = {
      clientID: envConstants.twitch_client_id,
      clientSecret: envConstants.twitch_client_secret,
      callbackURL: callbackOf(constants.services.twitch.slug),
      scope: TwitchStrategy.SCOPES,
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): OAuth2Provider {
    return {
      connection_name: constants.services.twitch.name,
      account_identifier: profile.id,
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: TwitchStrategy.SCOPES,
    };
  }
}
