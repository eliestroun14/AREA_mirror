import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  YoutubeNewSubscriberPollComparisonData,
  YoutubeNewSubscriberPollPayload,
} from '@root/services/youtube/triggers/new-subscriber/youtube-new-subscriber.dto';

export class YoutubeNewSubscriberPoll extends PollTrigger<
  YoutubeNewSubscriberPollPayload,
  YoutubeNewSubscriberPollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<YoutubeNewSubscriberPollComparisonData>
  > {

    const response = await fetch (
      `https://www.googleapis.com/youtube/v3/channels?mine=true&part=statistics`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )

    if (!response.ok) {
      console.log("#########################")
      console.log("##########ERROR##########")
      console.log("#########################")
      console.log(await response.text())
      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [],
        comparison_data: this.lastComparisonData,
        is_triggered: false,
      }
    }

    const subCount = await response.json() as {
      items: {
        statistics: {
          subscriberCount: string
        }
      }[]
    }

    if (!subCount.items || subCount.items.length === 0) {
      console.log("########################################################")
      console.log("#### !subCount.items || subCount.items.length === 0 ####")
      console.log("########################################################")
      console.log(subCount);
      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [],
        comparison_data: this.lastComparisonData,
        is_triggered: false,
      };
    }

    console.log(subCount);

    if (this.lastComparisonData === null) {
      const comparisonData: YoutubeNewSubscriberPollComparisonData = {
        subscriberCount: subCount.items[0].statistics.subscriberCount
      };
      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [],
        comparison_data: comparisonData,
        is_triggered: false,
      }
    }

    const currentCount = parseInt(subCount.items[0].statistics.subscriberCount, 10);
    const previousCount = parseInt(this.lastComparisonData.subscriberCount, 10);

    if (currentCount > previousCount) {
      const comparisonData: YoutubeNewSubscriberPollComparisonData = {
        subscriberCount: subCount.items[0].statistics.subscriberCount
      };
      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [
          {
            key: "NewSubscriberCount",
            value: (currentCount - previousCount).toString(),
          },
          {
            key: "TotalSubscriberCount",
            value: currentCount.toString(),
          },
        ],
        comparison_data: comparisonData,
        is_triggered: true,
      }
    } else {
        return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [],
        comparison_data: {
          subscriberCount: subCount.items[0].statistics.subscriberCount,
        },
        is_triggered: false,
      };
    }
  }
}
