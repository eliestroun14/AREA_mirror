import { Injectable } from '@nestjs/common';
import { DriveOAuthGuard } from '@app/oauth2/services/drive/drive.guard';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AREA_OAuth2Controller } from '@app/oauth2/services/service.controller';
import { services } from '@root/prisma/services-data/services.data';

@Injectable()
export class DriveOAuth2Controller extends AREA_OAuth2Controller(
  services.drive.name,
  services.drive.slug,
  DriveOAuthGuard,
) {
  constructor(connectionService: ConnectionsService) {
    super(connectionService);
  }
}
