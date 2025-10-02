import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-google-oauth20';
import { GmailProvider } from '@app/oauth2/services/gmail/gmail.dto';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';

@Injectable()
export class GmailStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const options: StrategyOptions = {
      clientID: envConstants.google_client_id,
      clientSecret: envConstants.google_client_secret,
      callbackURL: callbackOf('gmail'),
      scope: ['email'],
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): GmailProvider {
    return {
      connection_name: 'Gmail',
      account_identifier: profile.id,
      email: profile.emails?.[0]?.value ?? 'none',
      username: profile.username ?? '',
      picture: profile.photos?.[0]?.value ?? '/assets/placeholder.png',
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: ['email'],
    };
  }
}
