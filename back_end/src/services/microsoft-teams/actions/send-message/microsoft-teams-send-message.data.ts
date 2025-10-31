import { ServiceAction } from '@root/prisma/services-data/services.dto';

export const microsoftTeamsSendMessageData: ServiceAction = {
  class_name: 'MicrosoftTeamsSendMessageExecutor',
  http_requests: {
    method: 'POST',
    endpoint: '/v1.0/teams/{team-id}/channels/{channel-id}/messages',
    description:
      'Send a message to a Microsoft Teams channel',
  },
  name: 'Send Message',
  description: 'Send a message to a Microsoft Teams channel',
  require_connection: true,
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
    message: {
      key: 'message',
      field_name: 'Message',
      required: true,
      type: 'string',
      default_value: 'Hello from AREA!',
      placeholder: 'Type your message here...',
      field_order: 2,
      is_active: true,
      select_options: [],
      validation_rules: {},
    },
  },
  variables: [
    { name: 'message_id' },
    { name: 'message_sent' },
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
