import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {
  Strategy,
  StrategyOptions,
  Profile,
  VerifyCallback,
} from 'passport-spotify';
import {envConstants} from "@app/auth/constants";
import {ServiceProviderData} from "@app/auth/services";

@Injectable()
export class SpotifyStrategy extends PassportStrategy(Strategy, 'spotify') {
  constructor() {
    const options: StrategyOptions = {
      clientID: envConstants.spotify_client_id,
      clientSecret: envConstants.spotify_client_secret,
      callbackURL: 'http://127.0.0.1:3000/connection/spotify/callback',
      scope: ['user-read-email', 'user-read-private', 'playlist-read-private'],
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): ServiceProviderData {
    return {
      provider: 'spotify',
      providerId: profile.id,
      email: profile.emails?.[0]?.value ?? 'none',
      username: profile.username,
      picture: profile.photos?.[0] ?? '/assets/placeholder.png',
      accessToken,
      refreshToken,
    };
  }
}
