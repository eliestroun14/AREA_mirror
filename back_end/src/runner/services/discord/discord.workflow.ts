import { ActionRunnerJob } from '@root/runner/zaps/actions/actions.runner.job';
import { ActionRunResult } from '@root/runner/zaps/actions/actions.runner.dto';
import { DiscordAction_SendMessage_Payload } from '@root/runner/services/discord/discord.dto';
import { RunnerExecutionStatus } from '@root/runner/runner.dto';

export default class DiscordAction_SendMessage extends ActionRunnerJob<DiscordAction_SendMessage_Payload> {
  protected async _execute(
    payload: DiscordAction_SendMessage_Payload,
  ): Promise<ActionRunResult> {
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
        status: RunnerExecutionStatus.SUCCESS,
      };
    }
    return {
      data: [],
      status: RunnerExecutionStatus.FAILURE,
    };
  }
}

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
