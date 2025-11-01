import { GithubOnNewRepositoryIssueTriggerPayload } from '@root/services/github/triggers/on-new-repository-issue/github-on-new-repository-issue.dto';
import { WebhookTrigger } from '@app/webhooks/webhooks.webhook';

export class GithubOnNewRepositoryIssueWebhookTrigger extends WebhookTrigger {
  static override async hook(
    webhookUrl: string,
    secret: string,
    payload: GithubOnNewRepositoryIssueTriggerPayload,
    accessToken: string,
  ): Promise<boolean> {
    const method = 'POST';
    const endpoint = `https://api.github.com/repos/${payload.owner}/${payload.repository}/hooks`;
    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
    };
    const body = JSON.stringify({
      name: 'web',
      active: true,
      events: ['issues'],
      config: {
        url: webhookUrl,
        content_type: 'json',
      },
    });

    const response = await fetch(endpoint, {
      method,
      headers,
      body,
    });

    return response.ok && response.status === 201;
  }
}
