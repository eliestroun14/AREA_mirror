import { Injectable } from '@nestjs/common';
import { YoutubeOAuthGuard } from '@root/services/youtube/oauth2/youtube.guard';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AREA_OAuth2Controller } from '@app/oauth2/services/service.controller';
import { constants } from '@config/utils';

@Injectable()
export class YoutubeOAuth2Controller extends AREA_OAuth2Controller(
  constants.services.youtube.name,
  constants.services.youtube.slug,
  YoutubeOAuthGuard,
) {
  constructor(connectionService: ConnectionsService) {
    super(connectionService);
  }
}
