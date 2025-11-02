import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const googleCalendarNewEventCreatedData: ServiceTrigger = {
  class_name: 'GoogleCalendarNewEventCreatedPoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'New Event Created',
  description: 'Trigger this when a new event is created in your Google Calendar.',
  require_connection: true,
  polling_interval: 1000 * 60,
  fields: {},
  variables: [
    {
      name: "EventName"
    },
    {
      name: "EventURL"
    }
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
