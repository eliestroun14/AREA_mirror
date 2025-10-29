import { Injectable } from '@nestjs/common';
import { GoogleCalendarOAuthGuard } from '@app/oauth2/services/google-calendar/google-calendar.guard';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { AREA_OAuth2Controller } from '@app/oauth2/services/service.controller';
import { services } from '@root/prisma/services-data/services.data';

@Injectable()
export class GoogleCalendarOAuth2Controller extends AREA_OAuth2Controller(
  services.googleCalendar.name,
  services.googleCalendar.slug,
  GoogleCalendarOAuthGuard,
) {
  constructor(connectionService: ConnectionsService) {
    super(connectionService);
  }
}
