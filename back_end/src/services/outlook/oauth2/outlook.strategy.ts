import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  ScopeType,
  Strategy,
  StrategyOptions,
} from 'passport-outlook';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { constants } from '@config/utils';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

@Injectable()
export class OutlookStrategy extends PassportStrategy(
  Strategy,
  'windowslive',
) {
  private static SCOPES: ScopeType = ['email', 'identify'];

  constructor() {
    const options: StrategyOptions = {
      clientID: envConstants.outlook_client_id,
      clientSecret: envConstants.outlook_client_secret,
      callbackURL: callbackOf(constants.services.outlook.slug),
      scope: OutlookStrategy.SCOPES,
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): OAuth2Provider {
    return {
      connection_name: constants.services.outlook.name,
      account_identifier: profile.id,
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: OutlookStrategy.SCOPES,
    };
  }
}
