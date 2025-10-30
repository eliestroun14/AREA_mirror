import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const outlookOnEmailReceiveData: ServiceTrigger = {
  class_name: 'OutlookOnEmailReceivePoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'Receive an email',
  description: 'Trigger when the user receive an email',
  require_connection: true,
  polling_interval: 1000,
  fields: {},
  variables: [],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
