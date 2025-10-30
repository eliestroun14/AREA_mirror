import { ActionExecutor } from '@root/runner/zaps/actions/actions.runner.job';
import { ActionRunResult } from '@root/runner/zaps/actions/actions.runner.dto';
import { GithubSendMessageActionPayload } from '@root/services/github/actions/send-message/github-send-message.dto';
import { RunnerExecutionStatus } from '@root/runner/runner.dto';

export default class GithubSendMessageExecutor extends ActionExecutor<GithubSendMessageActionPayload> {
  protected async _execute(
    payload: GithubSendMessageActionPayload,
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
