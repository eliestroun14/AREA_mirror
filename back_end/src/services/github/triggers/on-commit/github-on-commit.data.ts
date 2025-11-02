import { ServiceTrigger } from '@root/prisma/services-data/services.dto';
import { GithubOnCommitWebhookTrigger } from '@root/services/github/triggers/on-commit/github-on-commit.webhook';
import { GithubOnCommitTriggerPayload } from '@root/services/github/triggers/on-commit/github-on-commit.dto';

export const githubOnCommitData: ServiceTrigger = {
  class_name: '',
  http_requests: null,
  webhook: {
    slug: 'on-commit',
    total_received: 0,
    last_received_at: 0,
    hook(
      webhookUrl: string,
      secret: string,
      payload: object,
      accessToken: string,
    ) {
      return GithubOnCommitWebhookTrigger.hook(
        webhookUrl,
        secret,
        payload as GithubOnCommitTriggerPayload,
        accessToken,
      );
    },
  },
  trigger_type: 'WEBHOOK',
  name: 'On commit',
  description: 'When a commit is pushed',
  require_connection: true,
  polling_interval: 0,
  fields: {
    owner: {
      key: 'owner',
      required: true,
      type: 'string',
      select_options: [],
      field_name: 'Repository owner / organisation',
      default_value: '',
      placeholder: 'AREA-REN',
      field_order: 0,
      validation_rules: {},
      is_active: true,
    },
    repository: {
      key: 'repository',
      required: true,
      type: 'string',
      select_options: [],
      field_name: 'Repository name',
      default_value: '',
      placeholder: 'repository-name',
      field_order: 0,
      validation_rules: {},
      is_active: true,
    },
  },
  variables: [
    { name: 'AfterRef' },
    { name: 'BeforeRef' },
    { name: 'CommitRef' },
    { name: 'HeadCommitMessage' },
    { name: 'HeadCommitRef' },
    { name: 'HeadCommitUrl' },
    { name: 'RepositoryName' },
    { name: 'RepositoryFullName' },
    { name: 'RepositoryDescription' },
    { name: 'RepositoryUrl' },
    { name: 'RepositoryVisibility' },
    { name: 'PusherEmail' },
    { name: 'PusherName' },
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
