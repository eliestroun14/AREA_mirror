import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  Strategy,
  StrategyOptions,
} from 'passport-google-oauth20';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { services } from '@root/prisma/services-data/services.data';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

@Injectable()
export class GoogleCalendarStrategy extends PassportStrategy(Strategy, 'google-calendar') {
  private static SCOPES: string[] = [
    'email',
  ];

  constructor() {
    const options: StrategyOptions = {
      clientID: envConstants.google_calendar_client_id,
      clientSecret: envConstants.google_calendar_client_secret,
      callbackURL: callbackOf(services.googleCalendar.slug),
      scope: GoogleCalendarStrategy.SCOPES,
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): OAuth2Provider {
    console.log("Validating");
    console.log("access token: ", accessToken);
    console.log("refresh token: ", refreshToken);
    console.log("profile token: ", profile);
    return {
      connection_name: services.googleCalendar.name,
      account_identifier: profile.id,
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: GoogleCalendarStrategy.SCOPES,
    };
  }
}
