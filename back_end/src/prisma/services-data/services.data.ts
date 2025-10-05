import { Service } from '@root/prisma/services-data/services.dto';

export const services = {
  gmail: { name: 'Gmail', slug: 'gmail' },
  github: { name: 'Github', slug: 'github' },
  discord: { name: 'Discord', slug: 'discord' },
};

export const servicesData: Service[] = [
  {
    name: services.discord.name,
    serviceColor: '#7289da',
    iconUrl: '/assets/discord.png',
    apiBaseUrl: 'https://discord.com/api',
    authType: 'oauth2',
    documentationUrl: 'https://discord.com/developers/docs/reference/',
    isActive: true,
    triggers: [],
    actions: [
      {
        http_request: {
          description: 'Send a message.',
          method: 'POST',
          endpoint: 'https://discord.com/api/webhooks/',
          body_schema: {
            content: '',
          },
          header_schema: {},
        },
        class_name: 'DiscordAction_SendMessage',
        name: 'Send message',
        description: 'Send a message to Discord using a webhook.',
        fields: {
          message: {
            key: 'message',
            required: true,
            type: 'string',
            select_options: [],
            field_name: 'Message',
            default_value: 'Hello from AREA!',
            placeholder: 'Your message',
            field_order: 1,
            validation_rules: {},
            is_active: true,
          },
          webhook_url: {
            key: 'webhook_url',
            required: true,
            type: 'string',
            select_options: [],
            field_name: 'Webhook URL',
            default_value:
              'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_SECRET',
            placeholder: 'Your webhook URL',
            field_order: 0,
            validation_rules: {},
            is_active: true,
          },
        },
        variables: [],
        is_active: false,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      },
    ],
  },
  {
    name: services.github.name,
    serviceColor: '#21262d',
    iconUrl: '/assets/github.png',
    apiBaseUrl: 'https://api.github.com',
    authType: 'oauth2',
    documentationUrl: 'https://docs.github.com/en/rest/',
    isActive: true,
    triggers: [
      // {
      //   class_name: 'GithubTrigger_OnNewRepository',
      //   http_request: null,
      //   // webhook: {},
      //   trigger_type: 'WEBHOOK',
      //   name: 'On new Github Repository',
      //   description: 'Detect when a new repository is created on your profile.',
      //   polling_interval: null,
      //   fields: [
      //     {
      //       key: 'owner',
      //       required: true,
      //       type: 'string',
      //       select_options: [],
      //       field_name: 'Repository Owner',
      //       default_value: 'nl1x',
      //       placeholder: 'Owner',
      //       field_order: 1,
      //       validation_rules: {},
      //       is_active: true,
      //     },
      //     {
      //       key: '',
      //       required: false,
      //       type: 'string',
      //       select_options: [],
      //       field_name: '',
      //       default_value: '',
      //       placeholder: '',
      //       field_order: 0,
      //       validation_rules: undefined,
      //       is_active: false,
      //     }
      //   variables: [],
      //   is_active: false,
      //   created_at: undefined,
      //   updated_at: undefined,
      // },
    ],
    actions: [],
  },
  {
    name: services.gmail.name,
    serviceColor: '#4285F4',
    iconUrl: '/assets/gmail.png',
    apiBaseUrl: 'https://gmail.googleapis.com',
    authType: 'oauth2',
    documentationUrl:
      'https://developers.google.com/workspace/gmail/api/reference/rest',
    isActive: true,
    triggers: [],
    actions: [],
  },
];
