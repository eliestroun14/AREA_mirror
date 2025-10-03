import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions, Profile } from 'passport-deezer';
import { envConstants } from '@app/auth/constants';
import { ServiceProviderData } from '@app/auth/services';

@Injectable()
export class DeezerStrategy extends PassportStrategy(Strategy, 'deezer') {
  constructor() {
    const options: StrategyOptions = {
      clientID: envConstants.deezer_client_id,
      clientSecret: envConstants.deezer_client_secret,
      callbackURL: 'http://localhost:3000/auth/deezer/callback',
      scope: ['basic_access', 'email', 'offline_access', 'manage_library'],
    };

    super(options);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ): Promise<ServiceProviderData> {
    return {
      provider: 'Deezer',
      providerId: profile.id.toString(),
      username: profile.displayName,
      email: profile.emails?.[0]?.value,
      picture: profile.photos?.[0].value,
      accessToken,
      refreshToken,
    };
  }
}
