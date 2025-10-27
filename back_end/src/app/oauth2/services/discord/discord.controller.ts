import { Injectable } from '@nestjs/common';
import { DiscordOAuthGuard } from '@app/oauth2/services/discord/discord.guard';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AREA_OAuth2Controller } from '@app/oauth2/services/service.controller';

@Injectable()
export class DiscordOAuth2Controller extends AREA_OAuth2Controller(
  'discord',
  DiscordOAuthGuard,
) {
  constructor(connectionService: ConnectionsService) {
    super(connectionService);
  }
}
