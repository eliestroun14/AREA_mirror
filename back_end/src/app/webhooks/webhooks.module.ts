import { Module } from '@nestjs/common';
import { ZapsService } from '@app/zaps/zaps.service';
import { TriggersService } from '@app/services/triggers/triggers.service';
import { ActionsService } from '@app/services/actions/actions.service';
import { RunnerModule } from '@root/runner/runner.module';
import { StepsService } from '@app/zaps/steps/steps.service';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { ServicesService } from '@app/services/services.service';
import { WebhooksService } from '@app/webhooks/webhooks.service';
import { GithubOnNewIssueWebhookController } from '@root/services/github/triggers/on-new-issue/github-on-new-issue.controller';
import { YoutubeNewVideoUploadWebhookController } from '@root/services/youtube/triggers/new-video-upload/youtube-new-video-upload.controller';
import { GithubOnNewOrganisationRepositoryWebhookController } from '@root/services/github/triggers/on-new-organisation-repository/github-on-new-organisation-repository.controller';
import { GithubOnNewRepositoryIssueWebhookController } from '@root/services/github/triggers/on-new-repository-issue/github-on-new-repository-issue.controller';
import { GithubOnCommitWebhookController } from '@root/services/github/triggers/on-commit/github-on-commit.controller';

@Module({
  controllers: [
    YoutubeNewVideoUploadWebhookController,
    GithubOnNewOrganisationRepositoryWebhookController,
    GithubOnNewRepositoryIssueWebhookController,
    GithubOnCommitWebhookController,
  ],
  providers: [
    ConnectionsService,
    WebhooksService,
    ZapsService,
    StepsService,
    ServicesService,
    TriggersService,
    ActionsService,
  ],
  imports: [RunnerModule],
})
export class WebhooksModule {}
