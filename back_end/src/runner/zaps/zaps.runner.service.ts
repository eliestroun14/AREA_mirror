import { zaps } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import { RunnerCheckResult, RunnerExecutionStatus } from '@root/runner/runner.dto';
import { TriggersRunnerService } from '@root/runner/zaps/triggers/triggers.runner.service';
import { ZapJobsData } from '@root/runner/zaps/zaps.runner.dto';
import { ActionsRunnerService } from '@root/runner/zaps/actions/actions.runner.service';

@Injectable()
export class ZapsRunnerService {
  constructor(
    private prisma: PrismaService,
    private triggerService: TriggersRunnerService,
    private actionService: ActionsRunnerService,
  ) {}

  async getAllZaps(): Promise<zaps[]> {
    return this.prisma.zaps.findMany();
  }

  async isTriggered(zap: zaps): Promise<{ id: number; result: RunnerCheckResult }> {
    const triggerClass = await this.triggerService.getTriggerClassOf(zap);

    if (!triggerClass)
      return {
        id: -1,
        result: {
          status: RunnerExecutionStatus.FAILURE,
          data: [],
          is_triggered: false,
        },
      };

    return {
      id: triggerClass.getStepId(),
      result: await triggerClass.check(),
    };
  }

  async executeActionsOf(zap: zaps, jobsData: ZapJobsData): Promise<void> {
    const steps = await this.actionService.getAllActionsOf(zap.id);

    for (const step of steps) {
      const runResult = await this.actionService.executeAction(step, jobsData);
      jobsData[step.id] = { status: runResult.status, data: runResult.data };
    }
    await this.saveZapExecution(zap);
  }

  private async saveZapExecution(zap: zaps): Promise<void> {
    await this.prisma.zaps.update({
      where: {
        id: zap.id,
      },
      data: {
        last_run_at: new Date(Date.now()),
      },
    });
  }
}
