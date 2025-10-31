import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const twitchNewStreamStartedbyYouData: ServiceTrigger = {
  class_name: 'TwitchNewStreamStartedbyYouPoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'New stream started by you',
  description: 'This trigger fires every time you start streaming on Twitch.',
  require_connection: true,
  polling_interval: 10000,
  fields: {},
  variables: [
    { name: 'StreamTitle' },
    { name: 'GameName' },
    { name: 'ViewerCount' },
    { name: 'StreamUrl' },
    { name: 'StartedAt' },
    { name: 'ThumbnailUrl' },
    { name: 'Language' },
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
