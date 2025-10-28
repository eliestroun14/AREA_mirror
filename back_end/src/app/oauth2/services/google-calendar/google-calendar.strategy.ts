import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-google-oauth20'; // L'import dépend de passportjs !
import { GoogleCalendarProvider } from '@app/oauth2/services/google-calendar/google-calendar.dto';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { services } from '@root/prisma/services-data/services.data';

@Injectable()
export class GoogleCalendarStrategy extends PassportStrategy(Strategy, 'google-calendar') {
  private static SCOPES: string[] = ['email'];

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
  ): GoogleCalendarProvider {
    // Les fields `profile.XXX` dépendent de ce que propose le service !
    return {
      connection_name: services.googleCalendar.name,
      account_identifier: profile.id,
      email: profile.emails?.[0]?.value ?? 'none',
      username: profile.username ?? '',
      picture: profile.photos?.[0]?.value ?? '/assets/placeholder.png',
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: GoogleCalendarStrategy.SCOPES,
    };
  }
}