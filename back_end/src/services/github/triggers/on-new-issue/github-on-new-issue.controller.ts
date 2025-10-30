import { AREA_WebhookController } from '@app/webhooks/webhooks.controller';
import { RunnerVariableData } from '@root/runner/runner.dto';
import { WebhookController } from '@app/webhooks/webhooks.dto';
import { RunnerService } from '@root/runner/runner.service';
import { ZapsRunnerService } from '@root/runner/zaps/zaps.runner.service';
import {
  GithubOnNewIssueHeaders,
  GithubOnNewIssueBody,
  GithubOnNewIssueQueries,
} from '@root/services/github/triggers/on-new-issue/github-on-new-issue.dto';

@WebhookController('github/on-new-issue')
export class GithubOnNewIssueWebhookController extends AREA_WebhookController {
  constructor(
    workflowService: RunnerService,
    zapRunnerService: ZapsRunnerService,
  ) {
    super(workflowService, zapRunnerService);
  }

  protected getVariablesData(
    headers: GithubOnNewIssueHeaders,
    body: GithubOnNewIssueBody,
    queries: GithubOnNewIssueQueries,
  ): RunnerVariableData[] {
    return [];
  }
}
