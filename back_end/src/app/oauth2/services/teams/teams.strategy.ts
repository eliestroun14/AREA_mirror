import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { TeamsProvider } from '@app/oauth2/services/teams/teams.dto';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { services } from '@root/prisma/services-data/services.data';

@Injectable()
export class TeamsStrategy extends PassportStrategy(Strategy, 'teams') {
  private readonly logger = new Logger(TeamsStrategy.name);

  // Scopes nécessaires pour Microsoft Teams
  private static SCOPES: string[] = [
    'openid',
    'profile',
    'email',
    'User.Read',
    'ChatMessage.Read',
    'ChatMessage.Send',
    'Group.ReadWrite.All',
    'Team.ReadBasic.All',
    'Channel.ReadBasic.All',
  ];

  constructor() {
    const callbackURL = callbackOf(services.teams.slug);

    const options = {
      clientID: envConstants.teams_client_id,
      clientSecret: envConstants.teams_client_secret,
      callbackURL: callbackURL,
      scope: TeamsStrategy.SCOPES,
      tenant: 'common',
    };

    super(options);

    this.logger.log(`Callback URL: ${callbackURL}`);
    this.logger.log(`Client ID: ${envConstants.teams_client_id}`);
    this.logger.log(`Scopes: ${TeamsStrategy.SCOPES.join(', ')}`);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): TeamsProvider {
    this.logger.log(`Profile received: ${JSON.stringify(profile, null, 2)}`);

    const provider = {
      connection_name: services.teams.name,
      account_identifier: profile.id,
      email: profile.emails?.[0]?.value ?? profile._json?.mail ?? 'none',
      username: profile.displayName ?? '',
      picture: profile.photos?.[0]?.value ?? '/assets/placeholder.png',
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: TeamsStrategy.SCOPES,
      tenant_id: profile._json?.tid ?? '',
      given_name: profile._json?.givenName ?? profile.name?.givenName ?? '',
      family_name: profile._json?.surname ?? profile.name?.familyName ?? '',
      upn: profile._json?.userPrincipalName ?? profile.userPrincipalName ?? '',
    } as TeamsProvider;

    this.logger.log(`Provider created: ${JSON.stringify(provider, null, 2)}`);
    return provider;
  }
}
