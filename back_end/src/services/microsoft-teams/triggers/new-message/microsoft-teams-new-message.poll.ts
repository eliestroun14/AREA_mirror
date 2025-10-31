import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  MicrosoftTeamsNewMessagePollComparisonData,
  MicrosoftTeamsNewMessagePollPayload,
} from '@root/services/microsoft-teams/triggers/new-message/microsoft-teams-new-message.dto';

export class MicrosoftTeamsNewMessagePoll extends PollTrigger<
  MicrosoftTeamsNewMessagePollPayload,
  MicrosoftTeamsNewMessagePollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<MicrosoftTeamsNewMessagePollComparisonData>
  > {
    try {
      if (!this.accessToken) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: {},
          is_triggered: false,
        };
      }

      const { team_id, channel_id } = this.payload;

      if (!team_id || !channel_id) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: {},
          is_triggered: false,
        };
      }

      // Construire l'URL pour récupérer les messages depuis Microsoft Graph API
      const url = `https://graph.microsoft.com/v1.0/teams/${team_id}/channels/${channel_id}/messages`;
      
      // Paramètres de requête pour filtrer par date si on a une dernière exécution
      const params = new URLSearchParams();
      if (this.lastExecution) {
        // Filtrer les messages créés après la dernière exécution
        const sinceDate = this.lastExecution.toISOString();
        params.append('$filter', `createdDateTime gt ${sinceDate}`);
      }
      params.append('$orderby', 'createdDateTime desc');
      params.append('$top', '10'); // Limiter à 10 messages max

      const fullUrl = `${url}?${params.toString()}`;

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch Teams messages:', response.statusText);
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: {},
          is_triggered: false,
        };
      }

      const data = await response.json();
      const messages = data.value || [];

      if (messages.length === 0) {
        return {
          status: RunnerExecutionStatus.SUCCESS,
          variables: [],
          comparison_data: this.lastComparisonData || {},
          is_triggered: false,
        };
      }

      // Récupérer le premier message (le plus récent)
      const latestMessage = messages[0];
      const latestMessageId = latestMessage.id;

      // Vérifier si c'est un nouveau message
      const isNewMessage = !this.lastComparisonData?.lastMessageId || 
                          this.lastComparisonData.lastMessageId !== latestMessageId;

      if (!isNewMessage) {
        return {
          status: RunnerExecutionStatus.SUCCESS,
          variables: [],
          comparison_data: { lastMessageId: latestMessageId },
          is_triggered: false,
        };
      }

      // Préparer les variables pour les actions suivantes
      const variables = [
        { key: 'message_id', value: latestMessage.id },
        { key: 'message_content', value: latestMessage.body?.content || '' },
        { key: 'sender_name', value: latestMessage.from?.user?.displayName || 'Unknown' },
        { key: 'sender_email', value: latestMessage.from?.user?.userPrincipalName || '' },
        { key: 'created_at', value: latestMessage.createdDateTime },
      ];

      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables,
        comparison_data: { lastMessageId: latestMessageId },
        is_triggered: true,
      };
    } catch (error) {
      console.error('Error in MicrosoftTeamsNewMessagePoll:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
        comparison_data: {},
        is_triggered: false,
      };
    }
  }
}
