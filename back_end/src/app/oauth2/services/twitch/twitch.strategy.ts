import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Scope } from '@hewmen/passport-twitch';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { services } from '@root/prisma/services-data/services.data';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

@Injectable()
export class TwitchStrategy extends PassportStrategy(Strategy, 'twitch') {
  private static SCOPES: Scope[] = [Scope.UserReadEmail];

  constructor() {
    super({
      clientID: envConstants.twitch_client_id,
      clientSecret: envConstants.twitch_client_secret,
      callbackURL: callbackOf(services.twitch.slug),
      scope: TwitchStrategy.SCOPES,
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): OAuth2Provider {
    return {
      connection_name: services.twitch.name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      account_identifier: profile.id,
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: TwitchStrategy.SCOPES,
    };
  }
}
