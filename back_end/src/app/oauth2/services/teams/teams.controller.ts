import { Injectable } from '@nestjs/common';
import { TeamsOAuthGuard } from '@app/oauth2/services/teams/teams.guard';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AREA_OAuth2Controller } from '@app/oauth2/services/service.controller';
import { services } from '@root/prisma/services-data/services.data';

@Injectable()
export class TeamsOAuth2Controller extends AREA_OAuth2Controller(
  services.teams.name,
  services.teams.slug,
  TeamsOAuthGuard,
) {
  constructor(connectionService: ConnectionsService) {
    super(connectionService);
  }
}
