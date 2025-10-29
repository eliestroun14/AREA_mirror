import { Injectable } from '@nestjs/common';
import { TwitchOAuthGuard } from '@app/oauth2/services/twitch/twitch.guard';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AREA_OAuth2Controller } from '@app/oauth2/services/service.controller';
import { services } from '@root/prisma/services-data/services.data';

@Injectable()
export class TwitchOAuth2Controller extends AREA_OAuth2Controller(
  services.twitch.name,
  services.twitch.slug,
  TwitchOAuthGuard,
) {
  constructor(connectionService: ConnectionsService) {
    super(connectionService);
  }
}
