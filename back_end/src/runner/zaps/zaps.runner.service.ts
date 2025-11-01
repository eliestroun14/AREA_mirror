import { zap_executions, zaps } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import { RunnerCheckResult, RunnerExecutionStatus, } from '@root/runner/runner.dto';
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
  ): Promise<{ id: number; result: RunnerCheckResult<any> }> {
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

  async executeActionsOf(
    zap: zaps,
    zap_execution: zap_executions,
    jobsData: ZapJobsData,
  ): Promise<boolean> {
    const steps = await this.actionService.getAllActionsOf(zap.id);

    for (const step of steps) {
      const startedAt = Date.now();
      const runResult = await this.actionService.executeAction(step, jobsData);
      jobsData[step.id] = {
        status: runResult.status,
        variables: runResult.variables,
      };
      const endedAt = Date.now();
      await this.prisma.zap_step_executions.create({
        data: {
          duration_ms: endedAt - startedAt,
          ended_at: new Date(endedAt),
          started_at: new Date(startedAt),
          zap_execution_id: zap_execution.id,
          zap_step_id: step.id,
          data: runResult.variables as object,
          status:
            runResult.status === RunnerExecutionStatus.SUCCESS
              ? 'SUCCESS'
              : 'FAILURE',
        },
      });
      if (runResult.status === RunnerExecutionStatus.FAILURE) return false;
    }
    return true;
  }

  async saveZapExecution(
    zap: zaps,
    hasFailed: boolean,
  ): Promise<zap_executions> {
    await this.prisma.zaps.update({
      where: {
        id: zap.id,
      },
      data: {
        last_run_at: new Date(Date.now()),
        failed_runs: zap.failed_runs + Number(hasFailed),
        successful_runs: zap.successful_runs + Number(!hasFailed),
        total_runs: zap.total_runs + 1,
      },
    });

    return this.prisma.zap_executions.create({
      data: {
        zap_id: zap.id,
        status: hasFailed ? 'FAILURE' : 'IN PROGRESS',
        duration_ms: 0,
        started_at: new Date(Date.now()),
      },
    });
  }

  async finishZapExecution(
    zapExecution: zap_executions,
    isFullyDone: boolean,
  ): Promise<void> {
    const endedAt = Date.now();

    await this.prisma.zap_executions.update({
      where: { id: zapExecution.id },
      data: {
        duration_ms: endedAt - zapExecution.started_at.getTime(),
        ended_at: new Date(endedAt),
        status: isFullyDone ? 'SUCCESS' : 'FAILURE',
      },
    });
  }
}
