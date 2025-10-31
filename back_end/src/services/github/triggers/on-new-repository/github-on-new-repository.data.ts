import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const githubOnNewRepositoryData: ServiceTrigger = {
  class_name: 'GithubOnNewRepositoryPoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'On new repository',
  description: 'Run a zap when a new repository is created.',
  require_connection: true,
  polling_interval: 1000,
  fields: {
    owner: {
      key: 'owner',
      field_name: "Nom d'utilisateur Github",
      required: true,
      type: 'string',
      default_value: 'nl1x',
      placeholder: 'nl1x',
      field_order: 0,
      is_active: true,
      select_options: [],
      validation_rules: {},
    },
  },
  variables: [{ name: 'RepositoryName' }],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
