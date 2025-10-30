import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  GithubOnNewRepositoryPollComparisonData,
  GithubOnNewRepositoryPayload,
} from '@root/services/github/triggers/on-new-repository/github-on-new-repository.dto';

export class GithubOnNewRepositoryPoll extends PollTrigger<
  GithubOnNewRepositoryPayload,
  GithubOnNewRepositoryPollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<GithubOnNewRepositoryPollComparisonData>
  > {
    const newRepository = 'example-name';
    const comparisonData = this.lastComparisonData
      ? this.lastComparisonData
      : { repositories: [] };

    if (comparisonData.repositories.includes(newRepository))
      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [],
        comparison_data: comparisonData,
        is_triggered: false,
      };

    comparisonData.repositories.push(newRepository);
    return {
      status: RunnerExecutionStatus.SUCCESS,
      variables: [
        {
          key: 'RepositoryName',
          value: newRepository,
        },
      ],
      comparison_data: comparisonData,
      is_triggered: true,
    };
  }
}
