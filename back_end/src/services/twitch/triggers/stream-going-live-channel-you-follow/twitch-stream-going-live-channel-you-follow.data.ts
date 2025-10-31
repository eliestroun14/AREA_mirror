import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const twitchStreamGoingLiveChannelYouFollowData: ServiceTrigger = {
  class_name: 'TwitchStreamGoingLiveChannelYouFollowPoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'Stream going live for a channel you follow',
  description:
    'This Trigger fires every time a stream is going live for the specified Channel that you follow.',
  require_connection: true,
  polling_interval: 1000,
  fields: {},
  variables: [
    { name: 'StreamTitle' },
    { name: 'GameName' },
    { name: 'ViewerCount' },
    { name: 'StreamUrl' },
    { name: 'StartedAt' },
    { name: 'ChannelName' },
    { name: 'ChannelLogin' },
    { name: 'ChannelId' },
    { name: 'ThumbnailUrl' },
    { name: 'Language' },
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
