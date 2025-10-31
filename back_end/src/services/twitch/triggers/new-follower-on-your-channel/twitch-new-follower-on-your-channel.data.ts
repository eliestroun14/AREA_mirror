import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const twitchNewFollowerOnYourChannelData: ServiceTrigger = {
  class_name: 'TwitchNewFollowerOnYourChannelPoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'New follower on your channel',
  description: 'Triggers when someone follows your Twitch channel.',
  require_connection: true,
  polling_interval: 10000,
  fields: {},
  variables: [
    { name: 'FollowerUserId' },
    { name: 'FollowerUserName' },
    { name: 'FollowerUserLogin' },
    { name: 'FollowedAt' },
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
