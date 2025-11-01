import { ServiceTrigger } from '@root/prisma/services-data/services.dto';
import { GithubOnNewRepositoryIssueWebhookTrigger } from '@root/services/github/triggers/on-new-repository-issue/github-on-new-repository-issue.webhook';
import { GithubOnNewRepositoryIssueTriggerPayload } from '@root/services/github/triggers/on-new-repository-issue/github-on-new-repository-issue.dto';

export const githubOnNewRepositoryIssueData: ServiceTrigger = {
  class_name: '',
  http_requests: null,
  webhook: {
    slug: 'on-new-repository-issue',
    total_received: 0,
    last_received_at: 0,
    hook(
      webhookUrl: string,
      secret: string,
      payload: object,
      accessToken: string,
    ) {
      return GithubOnNewRepositoryIssueWebhookTrigger.hook(
        webhookUrl,
        secret,
        payload as GithubOnNewRepositoryIssueTriggerPayload,
        accessToken,
      );
    },
  },
  trigger_type: 'WEBHOOK',
  name: 'On new repository issue',
  description:
    'When an issue is opened on a specific owned or public repository',
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
    { name: 'IssueTitle' },
    { name: 'IssueContent' },
    { name: 'IssueUrl' },
    { name: 'IssueTypeName' },
    { name: 'IssueTypeDescription' },
    { name: 'IssueState' },
    { name: 'RepositoryName' },
    { name: 'RepositoryDescription' },
    { name: 'RepositoryUrl' },
    { name: 'RepositoryVisibility' },
    { name: 'RepositoryOwnerName' },
    { name: 'RepositoryOwnerUrl' },
    { name: 'RepositoryOwnerType' },
    { name: 'RepositorySenderName' },
    { name: 'RepositorySenderUrl' },
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
