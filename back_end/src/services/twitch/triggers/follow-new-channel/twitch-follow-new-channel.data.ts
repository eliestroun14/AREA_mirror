import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const twitchFollowNewChannelData: ServiceTrigger = {
  class_name: 'TwitchFollowNewChannelPoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'You follow a new channel',
  description:
    'This trigger fires every time you follow a new channel on Twitch.',
  require_connection: true,
  polling_interval: 10000,
  fields: {},
  variables: [
    { name: 'ChannelName' },
    { name: 'ChannelId' },
    { name: 'ChannelLogin' },
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
