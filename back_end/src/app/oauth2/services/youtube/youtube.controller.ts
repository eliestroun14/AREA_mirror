import { Injectable } from '@nestjs/common';
import { YoutubeOAuthGuard } from '@app/oauth2/services/youtube/youtube.guard';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AREA_OAuth2Controller } from '@app/oauth2/services/service.controller';
import { services } from '@root/prisma/services-data/services.data';

@Injectable()
export class YoutubeOAuth2Controller extends AREA_OAuth2Controller(
  services.youtube.name,
  services.youtube.slug,
  YoutubeOAuthGuard,
) {
  constructor(connectionService: ConnectionsService) {
    super(connectionService);
  }
}
