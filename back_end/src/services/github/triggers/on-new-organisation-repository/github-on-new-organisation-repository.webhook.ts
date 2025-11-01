import { GithubOnNewOrganisationRepositoryTriggerPayload } from '@root/services/github/triggers/on-new-organisation-repository/github-on-new-organisation-repository.dto';
import { WebhookTrigger } from '@app/webhooks/webhooks.webhook';

export class GithubOnNewOrganisationRepositoryWebhookTrigger extends WebhookTrigger {
  static override async hook(
    webhookUrl: string,
    secret: string,
    payload: GithubOnNewOrganisationRepositoryTriggerPayload,
    accessToken: string,
  ): Promise<boolean> {
    const method = 'POST';
    const endpoint = `https://api.github.com/orgs/${payload.organisation}/hooks`;
    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
    };
    const body = JSON.stringify({
      name: 'web',
      active: true,
      events: ['repository'],
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
