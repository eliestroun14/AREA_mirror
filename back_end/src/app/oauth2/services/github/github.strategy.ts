import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-github2';
import { GithubProvider } from '@app/oauth2/services/github/github.dto';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { services } from '@root/prisma/services-data/services.data';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  private static SCOPES: string[] = ['user:email', 'repo'];

  constructor() {
    const options: StrategyOptions = {
      clientID: envConstants.github_client_id,
      clientSecret: envConstants.github_client_secret,
      callbackURL: callbackOf(services.github.slug),
      scope: GithubStrategy.SCOPES,
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): GithubProvider {
    return {
      connection_name: services.github.name,
      account_identifier: profile.id,
      email: profile.emails?.[0]?.value ?? 'none',
      username: profile.username ?? '',
      picture: profile.photos?.[0]?.value ?? '/assets/placeholder.png',
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: GithubStrategy.SCOPES,
    };
  }
}
