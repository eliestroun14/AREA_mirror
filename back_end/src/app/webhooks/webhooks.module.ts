import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { RunnerService } from '@root/runner/runner.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ZapsService } from '@app/zaps/zaps.service';
import { TriggersService } from '@app/services/triggers/triggers.service';
import { ActionsService } from '@app/services/actions/actions.service';
import { ZapsRunnerService } from '@root/runner/zaps/zaps.runner.service';
import { RunnerModule } from '@root/runner/runner.module';

@Module({
  controllers: [WebhooksController],
  providers: [
    RunnerService,
    PrismaService,
    ZapsService,
    TriggersService,
    ActionsService,
  ],
  imports: [
    RunnerModule,
  ]
})
export class WebhooksModule {}
