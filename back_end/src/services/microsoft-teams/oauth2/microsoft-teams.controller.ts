import { Injectable } from '@nestjs/common';
import { MicrosoftTeamsOAuthGuard } from '@root/services/microsoft-teams/oauth2/microsoft-teams.guard';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AREA_OAuth2Controller } from '@app/oauth2/services/service.controller';
import { constants } from '@config/utils';

@Injectable()
export class MicrosoftTeamsOAuth2Controller extends AREA_OAuth2Controller(
  constants.services.microsoftTeams.name,
  constants.services.microsoftTeams.slug,
  MicrosoftTeamsOAuthGuard,
) {
  constructor(connectionService: ConnectionsService) {
    super(connectionService);
  }
}
