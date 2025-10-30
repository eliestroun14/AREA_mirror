import { Injectable } from '@nestjs/common';
import { OutlookOAuthGuard } from '@root/services/outlook/oauth2/outlook.guard';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AREA_OAuth2Controller } from '@app/oauth2/services/service.controller';
import { constants } from '@config/utils';

@Injectable()
export class OutlookOAuth2Controller extends AREA_OAuth2Controller(
  constants.services.outlook.name,
  constants.services.outlook.slug,
  OutlookOAuthGuard,
) {
  constructor(connectionService: ConnectionsService) {
    super(connectionService);
  }
}
