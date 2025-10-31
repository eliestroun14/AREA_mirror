import { ServiceAction } from '@root/prisma/services-data/services.dto';

export const discordSendMessageData: ServiceAction = {
  class_name: 'DiscordSendMessageExecutor',
  http_requests: {
    method: 'POST',
    endpoint: '',
    description: 'Send a message to a discord channel using webhooks',
  },
  name: 'Send a message',
  description: 'Send a message to a discord channel using webhooks',
  require_connection: true,
  fields: {
    message: {
      key: 'message',
      required: true,
      type: 'string',
      select_options: [],
      field_name: 'Message',
      default_value: 'Hello from AREA!',
      placeholder: 'Type your message here...',
      field_order: 0,
      validation_rules: {},
      is_active: true,
    },
    webhook_url: {
      key: 'webhook_url',
      required: true,
      type: 'string',
      select_options: [],
      field_name: 'URL du Webhook',
      default_value:
        'https://discord.com/api/webhooks/{{WEBHOOK_ID}}/{{WEBHOOK_SECRET}}',
      placeholder: 'Enter your webhook url here...',
      field_order: 1,
      validation_rules: {},
      is_active: true,
    },
  },
  variables: [],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
