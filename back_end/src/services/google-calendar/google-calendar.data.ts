import { constants } from '@config/utils';
import { Service } from '@root/prisma/services-data/services.dto';

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
  triggers: [],
  actions: [],
};
