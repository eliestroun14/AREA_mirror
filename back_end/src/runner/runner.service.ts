import { Injectable } from '@nestjs/common';
import { Logger } from '@root/runner/logger/logger';
import { ZapsRunnerService } from '@root/runner/zaps/zaps.runner.service';
import { ZapJobsData } from '@root/runner/zaps/zaps.runner.dto';
import {
  RunnerExecutionStatus,
  RunnerVariableData,
} from '@root/runner/runner.dto';
import { zaps } from '@prisma/client';

@Injectable()
export class RunnerService {
  private logger = new Logger('workflow');

  constructor(private zapRunnerService: ZapsRunnerService) {}

  /**
   * Start the runner of the AREA.
   */
  async start() {
    while (true) {
      const zaps = await this.zapRunnerService.getAllZaps();

      for (const zap of zaps) {
        if (!zap.is_active) continue;
        try {
          const triggerResult = await this.zapRunnerService.isTriggered(zap);

          if (triggerResult.result.status === RunnerExecutionStatus.FAILURE)
            continue;

          const zapExecution = await this.zapRunnerService.saveZapExecution(
            zap,
            triggerResult.result.is_triggered,
          );
          await this.zapRunnerService.saveComparisonData(
            zap.id,
            triggerResult.result.comparison_data as object | null,
          );

          if (!triggerResult.result.is_triggered) continue;

          const jobsData: ZapJobsData = {
            [triggerResult.id]: {
              variables: triggerResult.result.variables,
              status: triggerResult.result.status,
            },
          };
          const isFullyDone = await this.zapRunnerService.executeActionsOf(
            zap,
            zapExecution,
            jobsData,
          );
          await this.zapRunnerService.finishZapExecution(
            zapExecution,
            isFullyDone,
          );
        } catch (e) {
          this.logger.error((e as Error).message);
        }
      }
    }
  }

  public async runWebhookActions(
    zap: zaps,
    triggerStepId: number,
    data: RunnerVariableData[],
  ) {
    const zapExecution = await this.zapRunnerService.saveZapExecution(
      zap,
      true,
    );
    const jobsData: ZapJobsData = {
      [triggerStepId]: {
        variables: data,
        status: RunnerExecutionStatus.SUCCESS,
      },
    };
    const isFullyDone = await this.zapRunnerService.executeActionsOf(
      zap,
      zapExecution,
      jobsData,
    );
    await this.zapRunnerService.finishZapExecution(zapExecution, isFullyDone);
  }
}
