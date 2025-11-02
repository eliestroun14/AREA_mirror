import { Injectable } from '@nestjs/common';
import { MicrosoftOnedriveOAuthGuard } from '@root/services/microsoft-onedrive/oauth2/microsoft-onedrive.guard';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AREA_OAuth2Controller } from '@app/oauth2/services/service.controller';
import { constants } from '@config/utils';

@Injectable()
export class MicrosoftOnedriveOAuth2Controller extends AREA_OAuth2Controller(
  constants.services.microsoftOnedrive.name,
  constants.services.microsoftOnedrive.slug,
  MicrosoftOnedriveOAuthGuard,
) {
  constructor(connectionService: ConnectionsService) {
    super(connectionService);
  }
}
