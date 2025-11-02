import { ActionExecutor } from '@root/runner/zaps/actions/actions.runner.job';
import { ActionRunResult } from '@root/runner/zaps/actions/actions.runner.dto';
import { GithubCreateAnIssueActionPayload } from '@root/services/github/actions/create-an-issue/github-create-an-issue.dto';
import { RunnerExecutionStatus } from '@root/runner/runner.dto';

export default class GithubCreateAnIssueExecutor extends ActionExecutor<GithubCreateAnIssueActionPayload> {
  protected async _execute(
    payload: GithubCreateAnIssueActionPayload,
  ): Promise<ActionRunResult> {
    const method = 'POST';
    const endpoint = `https://api.github.com/repos/${payload.owner}/${payload.repository}/issues`;
    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${this.accessToken}`,
    };
    const body = JSON.stringify({
      title: payload.title,
      body: payload.content,
      assignees: payload.assignees.split(','),
      labels: payload.labels.split(','),
    });

    const response = await fetch(endpoint, {
      method,
      headers,
      body,
    });

    if (!response.ok || response.status !== 201) {
      console.log('Failure: ', await response.text());
      return {
        variables: [],
        status: RunnerExecutionStatus.FAILURE,
      };
    }

    return {
      variables: [
        { key: 'IssueTitle', value: payload.title },
        { key: 'IssueContent', value: payload.content },
        { key: 'IssueAssignees', value: payload.assignees },
        { key: 'IssueLabels', value: payload.labels },
        { key: 'RepositoryName', value: payload.repository },
        { key: 'RepositoryOwner', value: payload.owner },
        {
          key: 'RepositoryUrl',
          value: `https://github.com/${payload.owner}/${payload.repository}`,
        },
      ],
      status: RunnerExecutionStatus.SUCCESS,
    };
  }
}
