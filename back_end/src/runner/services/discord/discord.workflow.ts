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
