import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { constants } from '@config/utils';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

@Injectable()
export class MicrosoftTeamsStrategy extends PassportStrategy(
  Strategy,
  'microsoft-teams',
) {
  private readonly logger = new Logger(MicrosoftTeamsStrategy.name);

  // Scopes nécessaires pour Microsoft MicrosoftTeams
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
    const callbackURL = callbackOf(constants.services.microsoftTeams.slug);

    const options = {
      clientID: envConstants.microsoft_teams_client_id,
      clientSecret: envConstants.microsoft_teams_client_secret,
      callbackURL: callbackURL,
      scope: MicrosoftTeamsStrategy.SCOPES,
      tenant: 'common',
    };

    super(options);

    this.logger.log(`Callback URL: ${callbackURL}`);
    this.logger.log(`Client ID: ${envConstants.microsoft_teams_client_id}`);
    this.logger.log(`Scopes: ${MicrosoftTeamsStrategy.SCOPES.join(', ')}`);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): OAuth2Provider {
    this.logger.log(`Profile received: ${JSON.stringify(profile, null, 2)}`);

    const provider = {
      connection_name: constants.services.microsoftTeams.name,
      account_identifier: profile.id,
      email: profile.emails?.[0]?.value ?? profile._json?.mail ?? 'none',
      username: profile.displayName ?? '',
      picture: profile.photos?.[0]?.value ?? '/assets/placeholder.png',
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: MicrosoftTeamsStrategy.SCOPES,
      tenant_id: profile._json?.tid ?? '',
      given_name: profile._json?.givenName ?? profile.name?.givenName ?? '',
      family_name: profile._json?.surname ?? profile.name?.familyName ?? '',
      upn: profile._json?.userPrincipalName ?? profile.userPrincipalName ?? '',
    } as OAuth2Provider;

    this.logger.log(`Provider created: ${JSON.stringify(provider, null, 2)}`);
    return provider;
  }
}
