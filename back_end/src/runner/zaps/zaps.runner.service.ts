import { zaps } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { TriggersRunnerService } from '@root/runner/zaps/triggers/triggers.runner.service';
import { ZapJobsData } from '@root/runner/zaps/zaps.runner.dto';
import { ActionsRunnerService } from '@root/runner/zaps/actions/actions.runner.service';
import { constants } from '@config/utils';

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

  async getZap(zapId: number, userId: number): Promise<zaps | null> {
    return await this.prisma.zaps.findFirst({
      where: { id: zapId, user_id: userId },
    });
  }

  async saveComparisonData(
    zapId: number,
    comparisonData: object | null,
  ): Promise<void> {
    await this.prisma.zaps.update({
      where: { id: zapId },
      data: {
        last_trigger_data: comparisonData ? comparisonData : undefined,
      },
    });
  }

  async isTriggered(
    zap: zaps,
  ): Promise<{ id: number; result: RunnerCheckResult<object> }> {
    const failureData = {
      id: -1,
      result: {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
        comparison_data: null,
        is_triggered: false,
      },
    };

    const triggerStep = await this.triggerService.getTriggerStepOf(zap.id);
    if (!triggerStep) return failureData;

    if (triggerStep.trigger.trigger_type === constants.trigger_types.webhook)
      return {
        id: -1,
        result: {
          status: RunnerExecutionStatus.SUCCESS,
          variables: [],
          comparison_data: null,
          is_triggered: false,
        },
      };

    const triggerClass = await this.triggerService.getTriggerClassOf(
      zap,
      triggerStep,
    );

    if (!triggerClass) return failureData;

    return {
      id: triggerClass.getStepId(),
      result: await triggerClass.check(),
    };
  }

  async executeActionsOf(zap: zaps, jobsData: ZapJobsData): Promise<void> {
    const steps = await this.actionService.getAllActionsOf(zap.id);

    for (const step of steps) {
      const runResult = await this.actionService.executeAction(step, jobsData);
      jobsData[step.id] = { status: runResult.status, data: runResult.variables };
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
