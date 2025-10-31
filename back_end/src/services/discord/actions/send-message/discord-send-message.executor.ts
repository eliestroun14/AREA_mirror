import { ActionExecutor } from '@root/runner/zaps/actions/actions.runner.job';
import { ActionRunResult } from '@root/runner/zaps/actions/actions.runner.dto';
import { DiscordSendMessageActionPayload } from '@root/services/discord/actions/send-message/discord-send-message.dto';
import { RunnerExecutionStatus } from '@root/runner/runner.dto';

export default class DiscordSendMessageExecutor extends ActionExecutor<DiscordSendMessageActionPayload> {
  protected async _execute(
    payload: DiscordSendMessageActionPayload,
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
        variables: [],
        status: RunnerExecutionStatus.SUCCESS,
      };
    }
    return {
      variables: [],
      status: RunnerExecutionStatus.FAILURE,
    };
  }
}
