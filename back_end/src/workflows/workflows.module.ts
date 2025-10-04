import { Module } from '@nestjs/common';
import { WorkflowService } from '@root/workflows/workflows.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ZapsService } from '@app/zaps/zaps.service';
import { StepsService } from '@app/zaps/steps/steps.service';
import { TriggersService } from '@app/services/triggers/triggers.service';
import { ActionsService } from '@app/services/actions/actions.service';

@Module({
  providers: [
    WorkflowService,
    PrismaService,
    ZapsService,
    TriggersService,
    ActionsService,
  ],
})
export class WorkflowsModule {
  async run() {

  }
}
