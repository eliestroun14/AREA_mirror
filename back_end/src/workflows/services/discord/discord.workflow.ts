import {
  ActionJob,
  CheckResult,
  RunResult,
  WebhookTriggerJob,
} from '@root/workflows/workflows.dto';
import { DiscordAction_SendMessage_Payload } from '@root/workflows/services/discord/discord.dto';

export default class DiscordAction_SendMessage implements ActionJob {
  public async run(
    accessToken: string | null,
    payload: DiscordAction_SendMessage_Payload,
  ): Promise<RunResult> {
    const result = await fetch(payload.webhook_url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        content: payload.message,
      }),
    });

    if (result.ok) {
      return {
        data: [],
        has_run: true,
      };
    }
    return {
      data: [],
      has_run: false,
    };
  }
}

export class DiscordTrigger_OnNewMessage implements WebhookTriggerJob {
  public async registerToWebhook(
    zapId: number,
    accessToken: string,
    payload: object,
  ): Promise<void> {

  }
  public async check(
    access_token: string | null,
    payload: object,
  ): Promise<CheckResult> {
    console.log('New message. Payload:', payload);
    return {
      is_triggered: false,
      data: [],
    };
  }
}
//
// function main() {
//   const action = new DiscordAction_SendMessage();
//
//   action
//     .run('', {
//       message: 'Hello test.',
//       webhook_url:
//         'https://discord.com/api/webhooks/1422301381682794698/fgO-nDvMdY4C5CSorqeEZ8yHXXYYYPKqiQyvJn-l-EqbzI1MHL9BvsjOYusFJZKbbPdN',
//     })
//     .then((res) => {
//       if (res.has_run) {
//         console.log('Response has run successfully.');
//         console.log(res.data);
//       } else {
//         console.log('Response failed to run.');
//       }
//     })
//     .catch((err) => {});
// }
