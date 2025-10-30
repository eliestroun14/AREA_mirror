import {
  RunnerExecutionStatus,
  RunnerVariableData,
} from '@root/runner/runner.dto';
import { ActionBuilderParams } from '@root/runner/zaps/actions/actions.runner.factory';
import { ActionExecutor } from '@root/runner/zaps/actions/actions.runner.job';
import { ActionRunResult } from '@root/runner/zaps/actions/actions.runner.dto';
import {
  TeamsSendMessageActionPayload,
  TeamsSendReactionActionPayload,
} from '@root/runner/services/teams/teams.dto';

export class TeamsAction_SendMessage extends ActionExecutor<TeamsSendMessageActionPayload> {
  constructor(params: ActionBuilderParams) {
    super(params);
  }

  protected async _execute(
    payload: TeamsSendMessageActionPayload,
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
      console.error('Error in TeamsAction_SendMessage:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
      };
    }
  }
}

export class TeamsAction_SendReaction extends ActionExecutor<TeamsSendReactionActionPayload> {
  constructor(params: ActionBuilderParams) {
    super(params);
  }

  protected async _execute(
    payload: TeamsSendReactionActionPayload,
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
      console.error('Error in TeamsAction_SendReaction:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
      };
    }
  }
}
