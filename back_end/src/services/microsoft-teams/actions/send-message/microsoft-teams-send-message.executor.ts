import { ActionExecutor } from '@root/runner/zaps/actions/actions.runner.job';
import { ActionRunResult } from '@root/runner/zaps/actions/actions.runner.dto';
import { MicrosoftTeamsSendMessageActionPayload } from '@root/services/microsoft-teams/actions/send-message/microsoft-teams-send-message.dto';
import { RunnerExecutionStatus } from '@root/runner/runner.dto';

export default class MicrosoftTeamsSendMessageExecutor extends ActionExecutor<MicrosoftTeamsSendMessageActionPayload> {
  protected async _execute(
    payload: MicrosoftTeamsSendMessageActionPayload,
  ): Promise<ActionRunResult> {
    try {
      if (!this.accessToken) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
        };
      }

      const { team_id, channel_id, message } = payload;

      if (!team_id || !channel_id || !message) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
        };
      }

      const url = `https://graph.microsoft.com/v1.0/teams/${team_id}/channels/${channel_id}/messages`;

      const body = {
        body: {
          contentType: 'text',
          content: message,
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error('Failed to send Teams message:', response.statusText);
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
        };
      }

      const responseData = (await response.json()) as { id: string };

      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [
          { key: 'message_id', value: responseData.id },
          { key: 'message_sent', value: 'true' },
        ],
      };
    } catch (error) {
      console.error('Error in MicrosoftTeamsSendMessageExecutor:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
      };
    }
  }
}
