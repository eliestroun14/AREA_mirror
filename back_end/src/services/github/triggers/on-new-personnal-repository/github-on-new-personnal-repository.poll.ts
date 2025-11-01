import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  GithubOnNewPersonnalRepositoryPollComparisonData,
  GithubOnNewPersonnalRepositoryPollPayload,
} from '@root/services/github/triggers/on-new-personnal-repository/github-on-new-personnal-repository.dto';

export class GithubOnNewPersonnalRepositoryPoll extends PollTrigger<
  GithubOnNewPersonnalRepositoryPollPayload,
  GithubOnNewPersonnalRepositoryPollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<GithubOnNewPersonnalRepositoryPollComparisonData>
  > {
    const comparisonData: GithubOnNewPersonnalRepositoryPollComparisonData =
      this.lastComparisonData ?? {
        repositories: [],
      };

    if (!this.accessToken) {
      console.log('Failure');
      return {
        variables: [],
        comparison_data: comparisonData,
        status: RunnerExecutionStatus.SUCCESS,
        is_triggered: false,
      };
    }

    const method = 'GET';
    const endpoint = `https://api.github.com/users/${this.payload.owner}/repos`;
    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: this.accessToken,
    };

    const response = await fetch(endpoint, {
      method,
      headers,
    });

    if (!response.ok || response.status !== 200) {
      console.log(`Invalid status (${response.status}:${response.ok})`);
      console.log(`Comp data is defined ? ${!!comparisonData}`);
      return {
        is_triggered: false,
        status: RunnerExecutionStatus.SUCCESS,
        comparison_data: comparisonData,
        variables: [],
      };
    }

    const fetchedRepositories = (await response.json()) as {
      name: string;
      full_name: string;
      private: boolean;
      html_url: string;
    }[];

    const newRepositories = fetchedRepositories.filter((repo) =>
      this.lastComparisonData?.repositories.includes(repo.name),
    );

    if (newRepositories.length > 0) {
      comparisonData.repositories.concat(newRepositories[0].name);
    }

    if (!this.lastComparisonData || newRepositories.length === 0) {
      console.log('Last comparison data is null or no new data has been fetch');
      return {
        status: RunnerExecutionStatus.SUCCESS,
        is_triggered: false,
        comparison_data: comparisonData,
        variables: [],
      };
    }

    console.log('Triggering...');
    return {
      status: RunnerExecutionStatus.SUCCESS,
      variables: [
        { key: 'RepositoryName', value: newRepositories[0].name },
        { key: 'RepositoryFullName', value: newRepositories[0].full_name },
        {
          key: 'RepositoryVisibility',
          value: newRepositories[0].private ? 'Private' : 'Public',
        },
        { key: 'RepositoryUrl', value: newRepositories[0].html_url },
      ],
      comparison_data: comparisonData,
      is_triggered: true,
    };
  }
}
