import { ServiceTrigger } from '@root/prisma/services-data/services.dto';
import { GithubOnNewIssueWebhookTrigger } from '@root/services/github/triggers/on-new-issue/github-on-new-issue.webhook';
import { GithubOnNewIssueTriggerPayload } from '@root/services/github/triggers/on-new-issue/github-on-new-issue.dto';

export const githubOnNewIssueData: ServiceTrigger = {
  class_name: '',
  http_requests: null,
  webhook: {
    slug: 'on-new-issue',
    total_received: 0,
    last_received_at: 0,
    hook(
      webhookUrl: string,
      secret: string,
      payload: object,
      accessToken: string,
    ) {
      return GithubOnNewIssueWebhookTrigger.hook(
        webhookUrl,
        secret,
        payload as GithubOnNewIssueTriggerPayload,
        accessToken,
      );
    },
  },
  trigger_type: 'WEBHOOK',
  name: '<TriggerTitle>',
  description: '<TriggerDescription>',
  require_connection: true,
  polling_interval: 0,
  fields: {},
  variables: [
    {
      name: '',
    },
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
