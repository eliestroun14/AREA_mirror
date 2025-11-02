import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  Strategy,
  StrategyOptions,
} from 'passport-google-oauth20';
import { envConstants } from '@config/env';
import { constants } from '@config/utils';
import { GoogleOAuth2Provider } from '@root/services/google-oauth-login/oauth2/google-oauth-login.dto';

@Injectable()
export class GoogleOauthLoginStrategy extends PassportStrategy(
  Strategy,
  constants.services.googleOauthLogin.slug,
) {
  private static SCOPES: string[] = ['email', 'profile'];

  constructor() {
    const options: StrategyOptions = {
      clientID: envConstants.google_client_id,
      clientSecret: envConstants.google_client_secret,
      callbackURL: `${envConstants.api_base_url}/auth/sign-in/google/callback`,
      scope: GoogleOauthLoginStrategy.SCOPES,
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): GoogleOAuth2Provider {
    return {
      displayName: profile.displayName,
      emails: profile.emails ?? [],
      name: {
        familyName: profile.name?.familyName ?? '',
        givenName: profile.name?.givenName ?? '',
      },
      photos: profile.photos ?? [],
      connection_name: constants.services.googleOauthLogin.name,
      account_identifier: profile.id,
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: GoogleOauthLoginStrategy.SCOPES,
    };
  }
}
