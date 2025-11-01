import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const githubOnNewPersonnalRepositoryData: ServiceTrigger = {
  class_name: 'GithubOnNewPersonnalRepositoryPoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'On new personal repository',
  description: 'When a new personal repository is created',
  require_connection: true,
  polling_interval: 1000 * 10,
  fields: {
    owner: {
      key: 'owner',
      required: true,
      type: 'string',
      select_options: [],
      field_name: 'Owner username',
      default_value: '',
      placeholder: 'nl1x',
      field_order: 0,
      validation_rules: {},
      is_active: true,
    },
  },
  variables: [
    { name: 'RepositoryName' },
    { name: 'RepositoryFullName' },
    { name: 'RepositoryVisibility' },
    { name: 'RepositoryUrl' },
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
