import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-google-oauth20';
import { envConstants } from '@app/auth/constants';
import { ServiceProviderData } from '@app/auth/services';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const options: StrategyOptions = {
      clientID: envConstants.google_client_id,
      clientSecret: envConstants.google_client_secret,
      callbackURL: 'http://localhost:3000/connection/google/callback',
      scope: ['email', 'profile'],
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): ServiceProviderData {
    return {
      provider: 'Google',
      providerId: profile.id,
      email: profile.emails?.[0]?.value ?? 'none',
      username: profile.username ?? '',
      picture: profile.photos?.[0]?.value ?? '/assets/placeholder.png',
      accessToken,
      refreshToken,
    };
  }
}
