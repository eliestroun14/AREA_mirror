import { ActionExecutor } from '@root/runner/zaps/actions/actions.runner.job';
import { ActionRunResult } from '@root/runner/zaps/actions/actions.runner.dto';
import { MicrosoftTeamsSendReactionActionPayload } from '@root/services/microsoft-teams/actions/send-reaction/microsoft-teams-send-reaction.dto';
import { RunnerExecutionStatus } from '@root/runner/runner.dto';

export default class MicrosoftTeamsSendReactionExecutor extends ActionExecutor<MicrosoftTeamsSendReactionActionPayload> {
  protected async _execute(
    payload: MicrosoftTeamsSendReactionActionPayload,
  ): Promise<ActionRunResult> {
    try {
      if (!this.accessToken) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
        };
      }

      const { team_id, channel_id, message_id, reaction } = payload;

      if (!team_id || !channel_id || !message_id || !reaction) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
        };
      }

      const url = `https://graph.microsoft.com/v1.0/teams/${team_id}/channels/${channel_id}/messages/${message_id}/reactions`;

      // Mapping des réactions vers les types Microsoft Graph
      const reactionTypeMap: Record<string, string> = {
        like: '👍',
        heart: '❤️',
        laugh: '😂',
        surprised: '😮',
        sad: '😢',
        angry: '😠',
      };

      const body = {
        reactionType: reactionTypeMap[reaction] || '👍',
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
        console.error('Failed to send Teams reaction:', response.statusText);
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
        };
      }

      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [
          { key: 'reaction_sent', value: 'true' },
          { key: 'reaction_type', value: reactionTypeMap[reaction] || '👍' },
        ],
      };
    } catch (error) {
      console.error('Error in MicrosoftTeamsSendReactionExecutor:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
      };
    }
  }
}
