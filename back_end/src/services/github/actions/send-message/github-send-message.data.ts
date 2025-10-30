import { ServiceAction } from '@root/prisma/services-data/services.dto';

export const githubSendMessageData: ServiceAction = {
  class_name: 'GithubSendMessageExecutor',
  http_requests: {
    method: 'POST',
    endpoint: '',
    description:
      'Post a new discord message using discord webhooks integration',
  },
  name: 'On new repository',
  description: 'Send a message to a discord channel using Discord webhooks.',
  require_connection: true,
  fields: {
    webhook_url: {
      key: 'webhook_url',
      field_name: 'Url du webhook discord',
      required: true,
      type: 'string',
      default_value:
        'https://discord.com/api/webhooks/{WEBHOOK_ID}/{WEBHOOK_SECRET}',
      placeholder:
        'https://discord.com/api/webhooks/{WEBHOOK_ID}/{WEBHOOK_SECRET}',
      field_order: 0,
      is_active: true,
      select_options: [],
      validation_rules: {},
    },
    message: {
      key: 'message',
      field_name: 'Message à envoyer',
      required: true,
      type: 'string',
      default_value: 'Hello from AREA!',
      placeholder: 'Type your message...',
      field_order: 0,
      is_active: true,
      select_options: [],
      validation_rules: {},
    },
  },
  variables: [{ name: 'Message' }],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
