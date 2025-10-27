import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-microsoft';
import { TeamsProvider } from '@app/oauth2/services/teams/teams.dto';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { services } from '@root/prisma/services-data/services.data';

@Injectable()
export class TeamsStrategy extends PassportStrategy(Strategy, 'teams') {
  private readonly logger = new Logger(TeamsStrategy.name);
  
  // Utilisons des scopes très basiques pour commencer
  private static SCOPES: string[] = [
    'openid',
    'profile', 
    'email',
  ];

  constructor() {
    const callbackURL = callbackOf(services.teams.slug);
    
    const options: StrategyOptions = {
      clientID: envConstants.teams_client_id,
      clientSecret: envConstants.teams_client_secret,
      callbackURL: callbackURL,
      scope: TeamsStrategy.SCOPES,
      tenant: 'common',
      // Suppression du resource pour éviter les conflits
    };

    super(options);
    
    this.logger.log(`Callback URL: ${callbackURL}`);
    this.logger.log(`Client ID: ${envConstants.teams_client_id}`);
    this.logger.log(`Scopes: ${TeamsStrategy.SCOPES.join(', ')}`);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): TeamsProvider {
    this.logger.log(`Profile received: ${JSON.stringify(profile, null, 2)}`);
    
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
