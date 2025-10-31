import { envConstants } from '@root/config/env';
import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  TwitchFollowedChannel,
  TwitchFollowedChannelsResponse,
  TwitchFollowNewChannelPollComparisonData,
  TwitchFollowNewChannelPollPayload,
  TwitchUserResponse,
} from '@root/services/twitch/triggers/follow-new-channel/twitch-follow-new-channel.dto';

export class TwitchFollowNewChannelPoll extends PollTrigger<
  TwitchFollowNewChannelPollPayload,
  TwitchFollowNewChannelPollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<TwitchFollowNewChannelPollComparisonData>
  > {
    try {
      const userRes = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Client-Id': envConstants.twitch_client_id,
        },
      });

      if (!userRes.ok) {
        throw new Error(`Failed to fetch user: ${userRes.statusText}`);
      }

      const userData: TwitchUserResponse =
        (await userRes.json()) as TwitchUserResponse;

      if (!userData.data || userData.data.length === 0) {
        throw new Error('No user data returned');
      }

      const userId = userData.data[0].id;

      const followsRes = await fetch(
        `https://api.twitch.tv/helix/channels/followed?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Client-Id': envConstants.twitch_client_id,
          },
        },
      );

      if (!followsRes.ok) {
        throw new Error(`Failed to fetch follows: ${followsRes.statusText}`);
      }

      const followsData: TwitchFollowedChannelsResponse =
        (await followsRes.json()) as TwitchFollowedChannelsResponse;

      const currentIds: string[] = followsData.data.map(
        (channel: TwitchFollowedChannel) => channel.broadcaster_id,
      );

      const oldIds: string[] =
        this.lastComparisonData?.followed_channel_ids ?? [];
      const newFollows: string[] = currentIds.filter(
        (id: string) => !oldIds.includes(id),
      );

      if (newFollows.length === 0) {
        return {
          status: RunnerExecutionStatus.SUCCESS,
          variables: [],
          comparison_data: { followed_channel_ids: currentIds },
          is_triggered: false,
        };
      }

      const newChannel: TwitchFollowedChannel | undefined =
        followsData.data.find(
          (channel: TwitchFollowedChannel) =>
            channel.broadcaster_id === newFollows[0],
        );

      if (!newChannel) {
        throw new Error('New channel not found in follow list');
      }

      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [
          { key: 'ChannelName', value: newChannel.broadcaster_name },
          { key: 'ChannelId', value: newChannel.broadcaster_id },
          { key: 'ChannelLogin', value: newChannel.broadcaster_login },
        ],
        comparison_data: { followed_channel_ids: currentIds },
        is_triggered: true,
      };
    } catch (error) {
      console.error('Twitch follow check error:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
        comparison_data: this.lastComparisonData ?? {
          followed_channel_ids: [],
        },
        is_triggered: false,
      };
    }
  }
}
