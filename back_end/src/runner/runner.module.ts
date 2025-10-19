import { Module } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import { ZapsRunnerService } from '@root/runner/zaps/zaps.runner.service';
import { TriggersRunnerService } from '@root/runner/zaps/triggers/triggers.runner.service';
import { ActionsRunnerService } from '@root/runner/zaps/actions/actions.runner.service';
import { TriggersRunnerFactory } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { ActionsRunnerFactory } from '@root/runner/zaps/actions/actions.runner.factory';
import { WorkflowService } from '@root/runner/workflows.service';

@Module({
  providers: [
    PrismaService,
    WorkflowService,
    ZapsRunnerService,
    TriggersRunnerService,
    TriggersRunnerFactory,
    ActionsRunnerService,
    ActionsRunnerFactory,
  ],
  exports: [
    ZapsRunnerService,
  ]
})
export class WorkflowsModule {}
