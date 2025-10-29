import { Module } from '@nestjs/common';
import { RunnerService } from '@root/runner/runner.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ZapsService } from '@app/zaps/zaps.service';
import { TriggersService } from '@app/services/triggers/triggers.service';
import { ActionsService } from '@app/services/actions/actions.service';
import { RunnerModule } from '@root/runner/runner.module';
import { GithubWebhookController } from '@app/webhooks/services/github/github.controller';
import { StepsService } from '@app/zaps/steps/steps.service';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { ServicesService } from '@app/services/services.service';
import { WebhooksService } from '@app/webhooks/webhooks.service';

@Module({
  controllers: [GithubWebhookController],
  providers: [
    RunnerService,
    ConnectionsService,
    WebhooksService,
    PrismaService,
    ZapsService,
    StepsService,
    ServicesService,
    TriggersService,
    ActionsService,
  ],
  imports: [RunnerModule],
})
export class WebhooksModule {}
