import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  TwitchNewVideoPostedByYouPollPayload,
  TwitchNewVideoPostedByYouPollComparisonData,
  TwitchVideosResponse,
  TwitchUsersResponse,
} from '@root/services/twitch/triggers/new-video-posted-by-you/twitch-new-video-posted-by-you.dto';
import { envConstants } from '@root/config/env';

export class TwitchNewVideoPostedByYouPoll extends PollTrigger<
  TwitchNewVideoPostedByYouPollPayload,
  TwitchNewVideoPostedByYouPollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<TwitchNewVideoPostedByYouPollComparisonData>
  > {
    try {
      const userResponse = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Client-Id': envConstants.twitch_client_id,
        },
      });

      if (!userResponse.ok) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: this.lastComparisonData || { lastVideoIds: [] },
          is_triggered: false,
        };
      }

      const userData: TwitchUsersResponse = await userResponse.json();

      if (!userData.data || userData.data.length === 0) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: this.lastComparisonData || { lastVideoIds: [] },
          is_triggered: false,
        };
      }

      const userId = userData.data[0].id;

      const videosUrl = new URL('https://api.twitch.tv/helix/videos');
      videosUrl.searchParams.append('user_id', userId);
      videosUrl.searchParams.append('type', 'upload');
      videosUrl.searchParams.append('first', '10');

      const videosResponse = await fetch(videosUrl.toString(), {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Client-Id': envConstants.twitch_client_id,
        },
      });

      if (!videosResponse.ok) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: this.lastComparisonData || { lastVideoIds: [] },
          is_triggered: false,
        };
      }

      const videosData: TwitchVideosResponse = await videosResponse.json();
      const videos = videosData.data || [];
      const currentVideoIds = videos.map((video) => video.id);

      const lastVideoIds = this.lastComparisonData?.lastVideoIds || [];

      const newVideoIds = currentVideoIds.filter(
        (id) => !lastVideoIds.includes(id),
      );

      if (newVideoIds.length === 0) {
        return {
          status: RunnerExecutionStatus.SUCCESS,
          variables: [],
          comparison_data: { lastVideoIds: currentVideoIds },
          is_triggered: false,
        };
      }

      const newVideos = videos.filter((video) =>
        newVideoIds.includes(video.id),
      );
      const latestVideo = newVideos.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )[0];

      const variables = [
        { key: 'VideoId', value: latestVideo.id },
        { key: 'VideoTitle', value: latestVideo.title },
        { key: 'VideoUrl', value: latestVideo.url },
        { key: 'VideoDescription', value: latestVideo.description },
        { key: 'VideoDuration', value: latestVideo.duration },
        { key: 'VideoCreatedAt', value: latestVideo.created_at },
        { key: 'VideoViewCount', value: latestVideo.view_count.toString() },
        { key: 'VideoThumbnailUrl', value: latestVideo.thumbnail_url },
      ];

      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables,
        comparison_data: { lastVideoIds: currentVideoIds },
        is_triggered: true,
      };
    } catch (error) {
      console.error('Error checking Twitch new video:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
        comparison_data: this.lastComparisonData || { lastVideoIds: [] },
        is_triggered: false,
      };
    }
  }
}
