import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-microsoft';
import { TeamsProvider } from '@app/oauth2/services/teams/teams.dto';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { services } from '@root/prisma/services-data/services.data';

@Injectable()
export class TeamsStrategy extends PassportStrategy(Strategy, 'teams') {
  private static SCOPES: string[] = [
    'openid',
    'profile', 
    'email',
    'offline_access',
    'https://graph.microsoft.com/Team.ReadBasic.All',
    'https://graph.microsoft.com/Channel.ReadBasic.All',
    'https://graph.microsoft.com/ChannelMessage.Read.All',
    'https://graph.microsoft.com/ChannelMessage.Send',
    'https://graph.microsoft.com/TeamMember.Read.All',
  ];

  constructor() {
    const options: StrategyOptions = {
      clientID: envConstants.teams_client_id,
      clientSecret: envConstants.teams_client_secret,
      callbackURL: callbackOf(services.teams.slug),
      scope: TeamsStrategy.SCOPES,
      tenant: 'common', // Permet l'authentification multi-tenant
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): TeamsProvider {
    return {
      connection_name: services.teams.name,
      account_identifier: profile.id,
      email: profile.emails?.[0]?.value ?? 'none',
      username: profile.displayName ?? '',
      picture: profile.photos?.[0]?.value ?? '/assets/placeholder.png',
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: TeamsStrategy.SCOPES,
      tenant_id: profile._json?.tid ?? '',
      given_name: profile._json?.given_name ?? '',
      family_name: profile._json?.family_name ?? '',
      upn: profile._json?.upn ?? '',
    };
  }
}
