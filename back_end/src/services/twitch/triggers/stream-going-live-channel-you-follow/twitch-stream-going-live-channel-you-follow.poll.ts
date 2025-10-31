import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  TwitchStreamGoingLiveChannelYouFollowPollComparisonData,
  TwitchStreamGoingLiveChannelYouFollowPollPayload,
  TwitchFollowedStreamsResponse,
  TwitchFollowedStream,
} from '@root/services/twitch/triggers/stream-going-live-channel-you-follow/twitch-stream-going-live-channel-you-follow.dto';
import { envConstants } from '@root/config/env';

export class TwitchStreamGoingLiveChannelYouFollowPoll extends PollTrigger<
  TwitchStreamGoingLiveChannelYouFollowPollPayload,
  TwitchStreamGoingLiveChannelYouFollowPollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<TwitchStreamGoingLiveChannelYouFollowPollComparisonData>
  > {
    try {
      const userResp = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Client-Id': envConstants.twitch_client_id,
        },
      });

      if (!userResp.ok) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: this.lastComparisonData || { lastLiveStreamIds: [] },
          is_triggered: false,
        };
      }

      const userJson = (await userResp.json()) as { data?: { id?: string }[] };
      const userId: string | undefined = userJson?.data?.[0]?.id;

      if (!userId) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: this.lastComparisonData || { lastLiveStreamIds: [] },
          is_triggered: false,
        };
      }

      console.debug(
        '[TwitchStreamGoingLiveChannelYouFollowPoll] authenticated userId=',
        userId,
      );

      const followedUrl = new URL(
        'https://api.twitch.tv/helix/streams/followed',
      );
      followedUrl.searchParams.append('user_id', userId);
      followedUrl.searchParams.append('first', '100');

      const streamsResp = await fetch(followedUrl.toString(), {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Client-Id': envConstants.twitch_client_id,
        },
      });

      if (!streamsResp.ok) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: this.lastComparisonData || { lastLiveStreamIds: [] },
          is_triggered: false,
        };
      }

      const streamsData =
        (await streamsResp.json()) as TwitchFollowedStreamsResponse;
      const streams: TwitchFollowedStream[] = streamsData.data || [];

      console.debug(
        '[TwitchStreamGoingLiveChannelYouFollowPoll] fetched followed streams count=',
        streams.length,
      );

      const currentLiveIds = streams.map((s) => s.id);
      const lastLiveIds = this.lastComparisonData?.lastLiveStreamIds || [];

      const newIds = currentLiveIds.filter((id) => !lastLiveIds.includes(id));

      if (newIds.length === 0) {
        return {
          status: RunnerExecutionStatus.SUCCESS,
          variables: [],
          comparison_data: { lastLiveStreamIds: currentLiveIds },
          is_triggered: false,
        };
      }

      const newStreams = streams.filter((s) => newIds.includes(s.id));
      const latest = newStreams
        .slice()
        .sort(
          (a, b) =>
            new Date(b.started_at).getTime() - new Date(a.started_at).getTime(),
        )[0];

      const variables = [
        { key: 'StreamTitle', value: latest.title },
        { key: 'GameName', value: latest.game_name ?? '' },
        { key: 'ViewerCount', value: String(latest.viewer_count ?? '') },
        { key: 'StreamUrl', value: `https://twitch.tv/${latest.user_login}` },
        { key: 'StartedAt', value: latest.started_at },
        { key: 'ChannelName', value: latest.user_name },
        { key: 'ChannelLogin', value: latest.user_login },
        { key: 'ChannelId', value: latest.user_id },
        { key: 'ThumbnailUrl', value: latest.thumbnail_url ?? '' },
        { key: 'Language', value: latest.language ?? '' },
      ];

      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables,
        comparison_data: { lastLiveStreamIds: currentLiveIds },
        is_triggered: true,
      };
    } catch (error) {
      console.error('Error checking followed streams:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
        comparison_data: this.lastComparisonData || { lastLiveStreamIds: [] },
        is_triggered: false,
      };
    }
  }
}
