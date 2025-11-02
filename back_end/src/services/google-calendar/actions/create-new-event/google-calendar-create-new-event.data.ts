import { ServiceAction } from '@root/prisma/services-data/services.dto';

export const googleCalendarCreateNewEventData: ServiceAction = {
  class_name: 'GoogleCalendarCreateNewEventExecutor',
  http_requests: {
    method: 'POST',
    endpoint: '',
    description:
      'Create a new event in your Google Calendar.',
  },
  name: 'Create New Event',
  description: 'Create a new event in your Google Calendar.',
  require_connection: true,
  fields: {
    summary: {
      key: 'summary',
      required: true,
      type: 'string',
      select_options: [],
      field_name: 'Title',
      default_value: 'New Event',
      placeholder: 'Defense AREA - 220 ',
      field_order: 0,
      validation_rules: {},
      is_active: true
    },
    description: {
      key: 'description',
      required: false,
      type: 'string',
      select_options: [],
      field_name: 'Description',
      default_value: '',
      placeholder: 'Set description here (if you want)',
      field_order: 1,
      validation_rules: {},
      is_active: true
    },
    start: {
      key: 'start',
      required: true,
      type: 'date',
      select_options: [],
      field_name: 'Date Time Start',
      default_value: '',
      placeholder: '2025-11-01T10:00:00',
      field_order: 2,
      validation_rules: {},
      is_active: true
    },
    end: {
      key: 'end',
      required: true,
      type: 'date',
      select_options: [],
      field_name: 'Date Time End',
      default_value: '',
      placeholder: '2025-11-01T11:00:00',
      field_order: 3,
      validation_rules: {},
      is_active: true
    }
  },
  variables: [
    {
      name: "EventId"
    },
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
