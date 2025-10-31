import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  YoutubeNewLikeOnVideoPollComparisonData,
  YoutubeNewLikeOnVideoPollPayload,
} from '@root/services/youtube/triggers/new-like-on-video/youtube-new-like-on-video.dto';

/*

1. On fetch les données de youtube
2. On regarde si notre lastComparisonData est null ou pas
   a. Si c'est le cas : On return avec les données du fetch de youtube dans le comparisonData
   b. Si c'est pas le cas : On suit les étapes suivantes
3. On filtre les donneés de youtube pour ne garder que les nouvelles données
4. Si il y a plusieurs nouvelles données, on ne gère que la première des nouvelles données

*/

export class YoutubeNewLikeOnVideoPoll extends PollTrigger<
  YoutubeNewLikeOnVideoPollPayload,
  YoutubeNewLikeOnVideoPollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<YoutubeNewLikeOnVideoPollComparisonData>
  > {

    const response = await fetch (
      `https://www.googleapis.com/youtube/v3/videos?part=id,snippet&myRating=like`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )

    if (!response.ok) {
      console.log(await response.text())
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
        comparison_data: this.lastComparisonData,
        is_triggered: false,
      }
    }

    const likedVideos = await response.json() as {
      items: {
        id: string;
        snippet: {
          title: string;
        }
      }[]
    };

    console.log(likedVideos);

    if (this.lastComparisonData === null) {
      const comparisonData: YoutubeNewLikeOnVideoPollComparisonData = {
        likedVideosId: likedVideos.items.map((video) => {
          return video.id;
        })
      };
      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [],
        comparison_data: comparisonData,
        is_triggered: false,
      }
    }

    const newLikedVideos = likedVideos.items.filter((value) => {
      return this.lastComparisonData?.likedVideosId.includes(value.id);
    });

    if (newLikedVideos.length > 0) {
      this.lastComparisonData?.likedVideosId.concat(newLikedVideos[0].id);
      return {
        status: RunnerExecutionStatus.SUCCESS,
        comparison_data: this.lastComparisonData,
        variables: [
          {
            key: 'VideoName',
            value: newLikedVideos[0].snippet.title,
          }
        ],
        is_triggered: true,
      }
    } else {
      return {
        status: RunnerExecutionStatus.SUCCESS,
        comparison_data: this.lastComparisonData,
        variables: [],
        is_triggered: false,
      }
    }
  }
}
