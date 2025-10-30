import { Injectable } from '@nestjs/common';
import { GithubOAuthGuard } from '@root/services/github/oauth2/github.guard';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AREA_OAuth2Controller } from '@app/oauth2/services/service.controller';
import { services } from '@root/prisma/services-data/services.data';

@Injectable()
export class GithubOAuth2Controller extends AREA_OAuth2Controller(
  services.github.name,
  services.github.slug,
  GithubOAuthGuard,
) {
  constructor(connectionService: ConnectionsService) {
    super(connectionService);
  }
}
