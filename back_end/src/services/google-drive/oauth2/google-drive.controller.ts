import { Injectable } from '@nestjs/common';
import { GoogleDriveOAuthGuard } from '@root/services/google-drive/oauth2/google-drive.guard';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AREA_OAuth2Controller } from '@app/oauth2/services/service.controller';
import { constants } from '@config/utils';

@Injectable()
export class GoogleDriveOAuth2Controller extends AREA_OAuth2Controller(
  constants.services.googleDrive.name,
  constants.services.googleDrive.slug,
  GoogleDriveOAuthGuard,
) {
  constructor(connectionService: ConnectionsService) {
    super(connectionService);
  }
}
