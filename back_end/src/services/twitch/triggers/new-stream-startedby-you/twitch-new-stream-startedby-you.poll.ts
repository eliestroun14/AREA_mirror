import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  TwitchNewStreamStartedbyYouPollComparisonData,
  TwitchNewStreamStartedbyYouPollPayload,
} from '@root/services/twitch/triggers/new-stream-startedby-you/twitch-new-stream-startedby-you.dto';
import { envConstants } from '@root/config/env';

export class TwitchNewStreamStartedbyYouPoll extends PollTrigger<
  TwitchNewStreamStartedbyYouPollPayload,
  TwitchNewStreamStartedbyYouPollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<TwitchNewStreamStartedbyYouPollComparisonData>
  > {
    try {
      // Resolve the authenticated Twitch user (the trigger is always "your" stream)
      const usersResp = await fetch('https://api.twitch.tv/helix/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Client-Id': envConstants.twitch_client_id,
        },
      });

      if (!usersResp.ok) {
        throw new Error(`Twitch users API error: ${usersResp.status}`);
      }

      const usersJson = (await usersResp.json()) as any;
      const userId: string | undefined = usersJson?.data?.[0]?.id;

      if (!userId) {
        // No authenticated user available — nothing to check.
        return {
          status: RunnerExecutionStatus.SUCCESS,
          variables: [],
          comparison_data: this.lastComparisonData || { isLive: false },
          is_triggered: false,
        };
      }

      // Now check streams for the authenticated user id
      const streamsResp = await fetch(
        `https://api.twitch.tv/helix/streams?user_id=${userId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Client-Id': envConstants.twitch_client_id,
          },
        },
      );

      if (!streamsResp.ok) {
        throw new Error(`Twitch streams API error: ${streamsResp.status}`);
      }

      const data: any = await streamsResp.json();
      const stream = data?.data?.[0] ?? null;
      const isCurrentlyLive = !!stream;
      const wasLive = this.lastComparisonData?.isLive || false;

      const isTriggered = !wasLive && isCurrentlyLive;

      const variables =
        isTriggered && stream
          ? [
              {
                key: 'StreamTitle',
                value: stream.title,
              },
              {
                key: 'GameName',
                value: stream.game_name,
              },
              {
                key: 'ViewerCount',
                value: String(stream.viewer_count ?? ''),
              },
              {
                key: 'StreamUrl',
                value: `https://twitch.tv/${stream.user_login}`,
              },
              {
                key: 'StartedAt',
                value: stream.started_at,
              },
            ]
          : [];

      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: variables,
        comparison_data: {
          isLive: isCurrentlyLive,
          streamId: stream?.id,
        },
        is_triggered: isTriggered,
      };
    } catch (error) {
      console.error('Error checking Twitch stream status:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
        comparison_data: this.lastComparisonData || { isLive: false },
        is_triggered: false,
      };
    }
  }
}
