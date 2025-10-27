import {
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { ActionBuilderParams } from '@root/runner/zaps/actions/actions.runner.factory';
import { ActionRunnerJob } from '@root/runner/zaps/actions/actions.runner.job';
import { ActionRunResult } from '@root/runner/zaps/actions/actions.runner.dto';
import { TeamsAction_SendMessage_Payload, TeamsAction_SendReaction_Payload } from '@root/runner/services/teams/teams.dto';

export class TeamsAction_SendMessage extends ActionRunnerJob<TeamsAction_SendMessage_Payload> {
  constructor(params: ActionBuilderParams) {
    super(params);
  }

  protected async _execute(payload: TeamsAction_SendMessage_Payload): Promise<ActionRunResult> {
    try {
      if (!this.accessToken) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          data: [],
        };
      }

      const { team_id, channel_id, message } = payload;

      if (!team_id || !channel_id || !message) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          data: [],
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
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error('Failed to send Teams message:', response.statusText);
        return {
          status: RunnerExecutionStatus.FAILURE,
          data: [],
        };
      }

      const responseData = await response.json();

      return {
        status: RunnerExecutionStatus.SUCCESS,
        data: [
          { key: 'message_id', value: responseData.id },
          { key: 'message_sent', value: 'true' },
        ],
      };
    } catch (error) {
      console.error('Error in TeamsAction_SendMessage:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        data: [],
      };
    }
  }
}

export class TeamsAction_SendReaction extends ActionRunnerJob<TeamsAction_SendReaction_Payload> {
  constructor(params: ActionBuilderParams) {
    super(params);
  }

  protected async _execute(payload: TeamsAction_SendReaction_Payload): Promise<ActionRunResult> {
    try {
      if (!this.accessToken) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          data: [],
        };
      }

      const { team_id, channel_id, message_id, reaction } = payload;

      if (!team_id || !channel_id || !message_id || !reaction) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          data: [],
        };
      }

      const url = `https://graph.microsoft.com/v1.0/teams/${team_id}/channels/${channel_id}/messages/${message_id}/reactions`;

      // Mapping des réactions vers les types Microsoft Graph
      const reactionTypeMap: Record<string, string> = {
        'like': '👍',
        'heart': '❤️',
        'laugh': '😂',
        'surprised': '😮',
        'sad': '😢',
        'angry': '😠',
      };

      const body = {
        reactionType: reactionTypeMap[reaction] || '👍',
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error('Failed to send Teams reaction:', response.statusText);
        return {
          status: RunnerExecutionStatus.FAILURE,
          data: [],
        };
      }

      return {
        status: RunnerExecutionStatus.SUCCESS,
        data: [
          { key: 'reaction_sent', value: 'true' },
          { key: 'reaction_type', value: reactionTypeMap[reaction] || '👍' },
        ],
      };
    } catch (error) {
      console.error('Error in TeamsAction_SendReaction:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        data: [],
      };
    }
  }
}
