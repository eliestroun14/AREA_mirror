import { constants } from '@config/utils';
import { Service } from '@root/prisma/services-data/services.dto';
import { googleCalendarNewEventCreatedData } from './triggers/new-event-created/google-calendar-new-event-created.data';
import { googleCalendarCreateNewEventData } from './actions/create-new-event/google-calendar-create-new-event.data';

export const googleCalendarData: Service = {
  name: constants.services.googleCalendar.name,
  slug: constants.services.googleCalendar.slug,
  serviceColor: '#2c6efc',
  iconUrl: '/assets/google-calendar.png',
  apiBaseUrl: 'https://www.googleapis.com/calendar/v3',
  authType: 'oauth2',
  documentationUrl:
    'https://developers.google.com/workspace/calendar/api/v3/reference',
  isActive: true,
  triggers: [
    googleCalendarNewEventCreatedData,
  ],
  actions: [
    googleCalendarCreateNewEventData
  ],
};
