import { AREA_WebhookController } from '@app/webhooks/webhooks.controller';
import { RunnerVariableData } from '@root/runner/runner.dto';
import { WebhookController } from '@app/webhooks/webhooks.dto';
import { RunnerService } from '@root/runner/runner.service';
import { ZapsRunnerService } from '@root/runner/zaps/zaps.runner.service';
import {
  GithubOnCommitHeaders, // Modifiez le type dans 'github-on-commit.dto.ts'.
  GithubOnCommitBody, // Modifiez le type dans 'github-on-commit.dto.ts'.
  GithubOnCommitQueries, // Modifiez le type dans 'github-on-commit.dto.ts'.
} from '@root/services/github/triggers/on-commit/github-on-commit.dto';

@WebhookController('github/on-commit')
export class GithubOnCommitWebhookController extends AREA_WebhookController {
  constructor(
    workflowService: RunnerService,
    zapRunnerService: ZapsRunnerService,
  ) {
    super(workflowService, zapRunnerService);
  }

  protected getVariablesData(
    headers: GithubOnCommitHeaders,
    body: GithubOnCommitBody,
    queries: GithubOnCommitQueries,
  ): RunnerVariableData[] {
    return [
      { key: 'AfterRef', value: body.after },
      { key: 'BeforeRef', value: body.before },
      { key: 'CommitRef', value: body.ref },
      { key: 'HeadCommitMessage', value: body.head_commit.message },
      { key: 'HeadCommitRef', value: body.head_commit.id },
      { key: 'HeadCommitUrl', value: body.head_commit.url },
      { key: 'RepositoryName', value: body.repository.name },
      { key: 'RepositoryFullName', value: body.repository.full_name },
      { key: 'RepositoryDescription', value: body.repository.description },
      { key: 'RepositoryUrl', value: body.repository.html_url },
      {
        key: 'RepositoryVisibility',
        value: body.repository.private ? 'Private' : 'Public',
      },
      { key: 'PusherEmail', value: body.pusher.email },
      { key: 'PusherName', value: body.pusher.name },
    ];
  }
}
