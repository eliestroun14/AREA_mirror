// import { CheckResult, WebhookTriggerRunnerJob } from '@root/runner/workflows.dto';
// import { envConstants } from '@config/env';
// import { GithubTrigger_OnNewRepository_Payload } from '@root/runner/services/github/github.dto';
//
// export default class GithubTrigger_OnNewRepository
//   implements WebhookTriggerRunnerJob
// {
//   public async check(
//     access_token: null,
//     payload: object,
//   ): Promise<CheckResult> {
//     console.log('payload: ', payload);
//     return {
//       data: [],
//       is_triggered: false,
//     };
//   }
//
//   public async registerToWebhook(
//     zapId: number,
//     accessToken: string,
//     payload: GithubTrigger_OnNewRepository_Payload,
//   ) {
//     // const webhookUrl = `${envConstants.api_base_url}/webhooks/github?zap_id=${zapId}`;
//     // const { owner, repo } = payload;
//     //
//     // try {
//     // const response = await fetch(
//     //   `https://api.github.com/repos/${owner}/${repo}/hooks`,
//     //   {
//     //     headers: {
//     //       Authorization: `Bearer ${accessToken}`,
//     //       Accept: 'application/vnd.github+json',
//     //       'X-GitHub-Api-Version': '2022-11-28',
//     //     },
//     //     method: 'POST',
//     //     body: JSON.stringify({
//     //       name: 'web',
//     //       active: true,
//     //       events: ['repository', 'create'],
//     //       config: {
//     //         url: webhookUrl,
//     //         content_type: 'json',
//     //         secret: 'SECRET',
//     //         insecure_ssl: '0',
//     //       },
//     //     }),
//     //   },
//     // );
//     // console.log('✅ Webhook créé:', response.json());
//     // return response.json();
//     // } catch (error) {
//     //   console.error('❌ Erreur création webhook:', error);
//     //   throw error;
//     // }
//   }
// }
