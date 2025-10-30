import { Injectable } from '@nestjs/common';
import { GoogleCalendarOAuthGuard } from '@root/services/google-calendar/oauth2/google-calendar.guard';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AREA_OAuth2Controller } from '@app/oauth2/services/service.controller';
import { constants } from '@config/utils';

@Injectable()
export class GoogleCalendarOAuth2Controller extends AREA_OAuth2Controller(
  constants.services.googleCalendar.name,
  constants.services.googleCalendar.slug,
  GoogleCalendarOAuthGuard,
) {
  constructor(connectionService: ConnectionsService) {
    super(connectionService);
  }
}
