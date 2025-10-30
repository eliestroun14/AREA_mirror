import { Injectable } from '@nestjs/common';
import { TwitchOAuthGuard } from '@root/services/twitch/oauth2/twitch.guard';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AREA_OAuth2Controller } from '@app/oauth2/services/service.controller';
import { constants } from '@config/utils';

@Injectable()
export class TwitchOAuth2Controller extends AREA_OAuth2Controller(
  constants.services.twitch.name,
  constants.services.twitch.slug,
  TwitchOAuthGuard,
) {
  constructor(connectionService: ConnectionsService) {
    super(connectionService);
  }
}
