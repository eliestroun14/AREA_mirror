import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  Strategy,
  StrategyOptions,
} from 'passport-google-oauth20';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { constants } from '@config/utils';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

@Injectable()
export class YoutubeStrategy extends PassportStrategy(
  Strategy,
  constants.services.youtube.slug,
) {
  private static SCOPES: string[] = ['email', 'identify'];

  constructor() {
    const options: StrategyOptions = {
      clientID: envConstants.youtube_client_id,
      clientSecret: envConstants.youtube_client_secret,
      callbackURL: callbackOf(constants.services.youtube.slug),
      scope: YoutubeStrategy.SCOPES,
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): OAuth2Provider {
    return {
      connection_name: constants.services.youtube.name,
      account_identifier: profile.id,
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: YoutubeStrategy.SCOPES,
    };
  }
}
