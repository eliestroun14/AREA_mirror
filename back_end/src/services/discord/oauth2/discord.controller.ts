import { Injectable } from '@nestjs/common';
import { DiscordOAuthGuard } from '@root/services/discord/oauth2/discord.guard';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AREA_OAuth2Controller } from '@app/oauth2/services/service.controller';
import { constants } from '@config/utils';

@Injectable()
export class DiscordOAuth2Controller extends AREA_OAuth2Controller(
  constants.services.discord.name,
  constants.services.discord.slug,
  DiscordOAuthGuard,
) {
  constructor(connectionService: ConnectionsService) {
    super(connectionService);
  }
}
