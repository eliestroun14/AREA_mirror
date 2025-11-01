import { AREA_WebhookController } from '@app/webhooks/webhooks.controller';
import { RunnerVariableData } from '@root/runner/runner.dto';
import { WebhookController } from '@app/webhooks/webhooks.dto';
import { RunnerService } from '@root/runner/runner.service';
import { ZapsRunnerService } from '@root/runner/zaps/zaps.runner.service';
import {
  GithubOnNewRepositoryIssueHeaders, // Modifiez le type dans 'github-on-new-repository-issue.dto.ts'.
  GithubOnNewRepositoryIssueBody, // Modifiez le type dans 'github-on-new-repository-issue.dto.ts'.
  GithubOnNewRepositoryIssueQueries, // Modifiez le type dans 'github-on-new-repository-issue.dto.ts'.
} from '@root/services/github/triggers/on-new-repository-issue/github-on-new-repository-issue.dto';

@WebhookController('github/on-new-repository-issue')
export class GithubOnNewRepositoryIssueWebhookController extends AREA_WebhookController {
  constructor(
    workflowService: RunnerService,
    zapRunnerService: ZapsRunnerService,
  ) {
    super(workflowService, zapRunnerService);
  }

  protected verify(
    headers: GithubOnNewRepositoryIssueHeaders,
    body: GithubOnNewRepositoryIssueBody,
    queries: GithubOnNewRepositoryIssueQueries,
  ): boolean {
    console.log('Action: ', body.action);
    return body.action === 'opened';
  }

  protected getVariablesData(
    headers: GithubOnNewRepositoryIssueHeaders,
    body: GithubOnNewRepositoryIssueBody,
    queries: GithubOnNewRepositoryIssueQueries,
  ): RunnerVariableData[] {
    console.log('Body: ');
    console.log(body);
    return [
      { key: 'IssueTitle', value: body.issue.title },
      { key: 'IssueContent', value: body.issue.body },
      { key: 'IssueUrl', value: body.issue.html_url },
      { key: 'IssueTypeName', value: body.issue?.type?.name || '' },
      {
        key: 'IssueTypeDescription',
        value: body.issue?.type?.description || '',
      },
      { key: 'IssueState', value: body.issue.state },
      { key: 'RepositoryName', value: body.repository.name },
      { key: 'RepositoryDescription', value: body.repository.description },
      { key: 'RepositoryUrl', value: body.repository.html_url },
      {
        key: 'RepositoryVisibility',
        value: body.repository.private ? 'Private' : 'Public',
      },
      { key: 'RepositoryOwnerName', value: body.repository.owner.login },
      { key: 'RepositoryOwnerUrl', value: body.repository.owner.html_url },
      { key: 'RepositoryOwnerType', value: body.repository.owner.type },
      { key: 'RepositorySenderName', value: body.sender.login },
      { key: 'RepositorySenderUrl', value: body.sender.html_url },
    ];
  }
}
