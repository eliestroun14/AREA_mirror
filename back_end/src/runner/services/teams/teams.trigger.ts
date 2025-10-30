import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import { TeamsTrigger_OnNewMessage_Payload } from '@root/runner/services/teams/teams.dto';

export class TeamsTrigger_OnNewMessage extends PollTrigger<
  TeamsTrigger_OnNewMessage_Payload,
  object
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<RunnerCheckResult<object>> {
    try {
      if (!this.accessToken) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: null,
          is_triggered: false,
        };
      }

      const { team_id, channel_id } = this.payload;

      if (!team_id || !channel_id) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: null,
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
          comparison_data: null,
          is_triggered: false,
        };
      }

      const data = await response.json();
      const messages = data.value || [];

      if (messages.length === 0) {
        return {
          status: RunnerExecutionStatus.SUCCESS,
          variables: [],
          comparison_data: null,
          is_triggered: false,
        };
      }

      // Transformer les messages en variables pour les actions suivantes
      const messageData = messages.map((message: any) => [
        { key: 'message_id', value: message.id },
        { key: 'message_content', value: message.body?.content || '' },
        { key: 'sender_name', value: message.from?.user?.displayName || 'Unknown' },
        { key: 'sender_email', value: message.from?.user?.userPrincipalName || '' },
        { key: 'created_at', value: message.createdDateTime },
      ]).flat();

      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: messageData,
        comparison_data: null,
        is_triggered: true,
      };
    } catch (error) {
      console.error('Error in TeamsTrigger_OnNewMessage:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
        comparison_data: null,
        is_triggered: false,
      };
    }
  }
}
