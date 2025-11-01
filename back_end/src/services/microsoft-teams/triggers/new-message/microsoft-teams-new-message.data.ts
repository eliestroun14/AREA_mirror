import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const microsoftTeamsNewMessageData: ServiceTrigger = {
  class_name: 'MicrosoftTeamsNewMessagePoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'New Message',
  description: 'Trigger when a new message is posted in a Teams channel',
  require_connection: true,
  polling_interval: 1800000, // 30 min
  fields: {
    team_id: {
      key: 'team_id',
      field_name: 'Team ID',
      required: true,
      type: 'string',
      default_value: '',
      placeholder: 'Enter the Teams Team ID',
      field_order: 0,
      is_active: true,
      select_options: [],
      validation_rules: {},
    },
    channel_id: {
      key: 'channel_id',
      field_name: 'Channel ID',
      required: true,
      type: 'string',
      default_value: '',
      placeholder: 'Enter the Teams Channel ID',
      field_order: 1,
      is_active: true,
      select_options: [],
      validation_rules: {},
    },
  },
  variables: [
    { name: 'message_id' },
    { name: 'message_content' },
    { name: 'sender_name' },
    { name: 'sender_email' },
    { name: 'created_at' },
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
