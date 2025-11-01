import { ServiceTrigger } from '@root/prisma/services-data/services.dto';
import { GithubOnNewOrganisationRepositoryWebhookTrigger } from '@root/services/github/triggers/on-new-organisation-repository/github-on-new-organisation-repository.webhook';
import { GithubOnNewOrganisationRepositoryTriggerPayload } from '@root/services/github/triggers/on-new-organisation-repository/github-on-new-organisation-repository.dto';

export const githubOnNewOrganisationRepositoryData: ServiceTrigger = {
  class_name: '',
  http_requests: null,
  webhook: {
    slug: 'on-new-organisation-repository',
    total_received: 0,
    last_received_at: 0,
    hook(
      webhookUrl: string,
      secret: string,
      payload: object,
      accessToken: string,
    ) {
      return GithubOnNewOrganisationRepositoryWebhookTrigger.hook(
        webhookUrl,
        secret,
        payload as GithubOnNewOrganisationRepositoryTriggerPayload,
        accessToken,
      );
    },
  },
  trigger_type: 'WEBHOOK',
  name: 'On new organisation repository',
  description:
    'When a new public repository of a specific organisation is created',
  require_connection: true,
  polling_interval: 0,
  fields: {
    organisation: {
      key: 'organisation',
      required: true,
      type: 'string',
      select_options: [],
      field_name: 'Organisation name',
      default_value: 'AREA-REN',
      placeholder: 'organisation-name',
      field_order: 0,
      validation_rules: {},
      is_active: true,
    },
  },
  variables: [
    { name: 'RepositoryName' },
    { name: 'RepositoryFullName' },
    { name: 'RepositoryDescription' },
    { name: 'RepositoryUrl' },
    { name: 'RepositoryVisibility' },
    { name: 'OrganisationName' },
    { name: 'CreatorName' },
    { name: 'CreatorUrl' },
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
