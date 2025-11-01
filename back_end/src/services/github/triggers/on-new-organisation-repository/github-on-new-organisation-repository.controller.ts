import { AREA_WebhookController } from '@app/webhooks/webhooks.controller';
import { RunnerVariableData } from '@root/runner/runner.dto';
import { WebhookController } from '@app/webhooks/webhooks.dto';
import { RunnerService } from '@root/runner/runner.service';
import { ZapsRunnerService } from '@root/runner/zaps/zaps.runner.service';
import {
  GithubOnNewOrganisationRepositoryHeaders, // Modifiez le type dans 'github-on-new-organisation-repository.dto.ts'.
  GithubOnNewOrganisationRepositoryBody, // Modifiez le type dans 'github-on-new-organisation-repository.dto.ts'.
  GithubOnNewOrganisationRepositoryQueries, // Modifiez le type dans 'github-on-new-organisation-repository.dto.ts'.
} from '@root/services/github/triggers/on-new-organisation-repository/github-on-new-organisation-repository.dto';

@WebhookController('github/on-new-organisation-repository')
export class GithubOnNewOrganisationRepositoryWebhookController extends AREA_WebhookController {
  constructor(
    workflowService: RunnerService,
    zapRunnerService: ZapsRunnerService,
  ) {
    super(workflowService, zapRunnerService);
  }

  protected verify(
    headers: GithubOnNewOrganisationRepositoryHeaders,
    body: GithubOnNewOrganisationRepositoryBody,
    queries: GithubOnNewOrganisationRepositoryQueries,
  ): boolean {
    return body.action === 'created';
  }

  protected getVariablesData(
    headers: GithubOnNewOrganisationRepositoryHeaders,
    body: GithubOnNewOrganisationRepositoryBody,
    queries: GithubOnNewOrganisationRepositoryQueries,
  ): RunnerVariableData[] {
    return [
      { key: 'RepositoryName', value: body.repository.name },
      { key: 'RepositoryFullName', value: body.repository.full_name },
      { key: 'RepositoryDescription', value: body.repository.description },
      { key: 'RepositoryUrl', value: body.repository.html_url },
      { key: 'OrganisationName', value: body.organization.login },
      {
        key: 'RepositoryVisibility',
        value: body.repository.private ? 'Private' : 'Public',
      },
      { key: 'CreatorName', value: body.sender.login },
      { key: 'CreatorUrl', value: body.sender.html_url },
    ];
  }
}
