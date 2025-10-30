import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  TwitchNewFollowerOnYourChannelPollPayload,
  TwitchNewFollowerOnYourChannelPollComparisonData,
} from './twitch-new-follower-on-your-channel.dto';

interface TwitchFollower {
  user_id: string;
  user_name: string;
  user_login: string;
  followed_at: string;
}

interface TwitchApiResponse<T> {
  data: T[];
  pagination?: {
    cursor?: string;
  };
}

export class TwitchNewFollowerOnYourChannelPoll extends PollTrigger<
  TwitchNewFollowerOnYourChannelPollPayload,
  TwitchNewFollowerOnYourChannelPollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<TwitchNewFollowerOnYourChannelPollComparisonData>
  > {
    try {
      const broadcasterId =
        this.lastComparisonData?.broadcasterId ||
        (await this.getBroadcasterIdFromToken());

      const currentFollowers = await this.getFollowers(broadcasterId);
      const oldFollowerIds = this.lastComparisonData?.lastFollowerIds || [];
      const currentFollowerIds = currentFollowers.map((f) => f.user_id);

      const newFollowerIds = currentFollowerIds.filter(
        (id) => !oldFollowerIds.includes(id),
      );

      if (newFollowerIds.length === 0) {
        return {
          status: RunnerExecutionStatus.SUCCESS,
          variables: [],
          comparison_data: {
            lastFollowerIds: currentFollowerIds.slice(0, 100),
            broadcasterId,
          },
          is_triggered: false,
        };
      }

      const newFollower = currentFollowers.find(
        (f) => f.user_id === newFollowerIds[0],
      );

      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [
          { key: 'FollowerUserId', value: newFollower!.user_id },
          { key: 'FollowerUserName', value: newFollower!.user_name },
          { key: 'FollowerUserLogin', value: newFollower!.user_login },
          { key: 'FollowedAt', value: newFollower!.followed_at },
        ],
        comparison_data: {
          lastFollowerIds: currentFollowerIds.slice(0, 100),
          broadcasterId,
        },
        is_triggered: true,
      };
    } catch (error) {
      console.error('Error checking followers:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
        comparison_data: this.lastComparisonData || {
          lastFollowerIds: [],
          broadcasterId: '',
        },
        is_triggered: false,
      };
    }
  }

  private async getFollowers(broadcasterId: string): Promise<TwitchFollower[]> {
    const url = new URL('https://api.twitch.tv/helix/channels/followers');
    url.searchParams.append('broadcaster_id', broadcasterId);
    url.searchParams.append('first', '100');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID || '',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Twitch API error: ${response.status} ${response.statusText}`,
      );
    }

    const data: TwitchApiResponse<TwitchFollower> = await response.json();
    return data.data;
  }

  private async getBroadcasterIdFromToken(): Promise<string> {
    const response = await fetch('https://api.twitch.tv/helix/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID || '',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Twitch API error: ${response.status} ${response.statusText}`,
      );
    }

    const data: TwitchApiResponse<{ id: string }> = await response.json();

    if (!data.data || data.data.length === 0) {
      throw new Error('Unable to get user from token');
    }

    return data.data[0].id;
  }
}
