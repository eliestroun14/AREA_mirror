import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-google-oauth20';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { services } from '@root/prisma/services-data/services.data';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

@Injectable()
export class DriveStrategy extends PassportStrategy(Strategy, 'google') {
  private static SCOPES: string[] = [
    'email',
    'profile',
    'https://www.googleapis.com/auth/drive.readonly',
    // 'https://www.googleapis.com/auth/drive',
    // 'https://www.googleapis.com/auth/drive.upload',
  ];

  constructor() {
    const options: StrategyOptions = {
      clientID: envConstants.drive_client_id,
      clientSecret: envConstants.drive_client_secret,
      callbackURL: callbackOf(services.drive.slug),
      scope: DriveStrategy.SCOPES,
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): OAuth2Provider {
    return {
      connection_name: services.drive.name,
      account_identifier: profile.id,
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: DriveStrategy.SCOPES,
    };
  }
}
