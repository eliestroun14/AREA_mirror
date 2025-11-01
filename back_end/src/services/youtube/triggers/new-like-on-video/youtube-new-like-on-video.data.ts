import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const youtubeNewLikeOnVideoData: ServiceTrigger = {
  class_name: 'YoutubeNewLikeOnVideoPoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'New Like on Video',
  description: 'Trigger this when you like a video on Youtube.',
  require_connection: true,
  polling_interval: 1000 * 60,
  fields: {},
  variables: [
    {
      name: "VideoName"
    }
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
