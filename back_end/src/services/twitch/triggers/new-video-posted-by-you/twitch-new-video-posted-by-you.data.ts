import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const twitchNewVideoPostedByYouData: ServiceTrigger = {
  class_name: 'TwitchNewVideoPostedByYouPoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'New video posted by you',
  description:
    ' This trigger fires every time there is a new video posted by you.',
  require_connection: true,
  polling_interval: 10000,
  fields: {},
  variables: [
    { name: 'VideoId' },
    { name: 'VideoTitle' },
    { name: 'VideoUrl' },
    { name: 'VideoDescription' },
    { name: 'VideoDuration' },
    { name: 'VideoCreatedAt' },
    { name: 'VideoViewCount' },
    { name: 'VideoThumbnailUrl' },
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
