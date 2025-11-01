import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const youtubeNewSubscriberData: ServiceTrigger = {
  class_name: 'YoutubeNewSubscriberPoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'New Subscriber on your Channel',
  description: 'Trigger this when a user subscribe to your channel.',
  require_connection: true,
  polling_interval: 1000 * 60,
  fields: {},
  variables: [
    {
      name: "NewSubscriberCount"
    },
    {
      name: "TotalSubscriberCount"
    }
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
