import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-github2'; // EDIT THIS LINE IF AN ERROR OCCURS
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { constants } from '@config/utils';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  private static SCOPES: string[] = ['email', 'identify'];

  constructor() {
    const options: StrategyOptions = {
      clientID: envConstants.github_client_id,
      clientSecret: envConstants.github_client_secret,
      callbackURL: callbackOf(constants.services.github.slug),
      scope: GithubStrategy.SCOPES,
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): OAuth2Provider {
    return {
      connection_name: constants.services.github.name,
      account_identifier: profile.id,
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: GithubStrategy.SCOPES,
    };
  }
}
