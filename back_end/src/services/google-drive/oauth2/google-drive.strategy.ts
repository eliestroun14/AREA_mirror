import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-google-oauth20';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { constants } from '@config/utils';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

@Injectable()
export class GoogleDriveStrategy extends PassportStrategy(
  Strategy,
  constants.services.googleDrive.slug,
) {
  private static SCOPES: string[] = [
    'email',
    'profile',
    'https://www.googleapis.com/auth/drive.readonly',
    // 'https://www.googleapis.com/auth/drive',
    // 'https://www.googleapis.com/auth/drive.upload',
  ];

  constructor() {
    const options: StrategyOptions = {
      clientID: envConstants.google_drive_client_id,
      clientSecret: envConstants.google_drive_client_secret,
      callbackURL: callbackOf(constants.services.googleDrive.slug),
      scope: GoogleDriveStrategy.SCOPES,
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): OAuth2Provider {
    return {
      connection_name: constants.services.googleDrive.name,
      account_identifier: profile.id,
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: GoogleDriveStrategy.SCOPES,
    };
  }
}
