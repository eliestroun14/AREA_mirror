import { Injectable } from '@nestjs/common';
import { Logger } from '@root/runner/logger/logger';
import { ZapsRunnerService } from '@root/runner/zaps/zaps.runner.service';
import { ZapJobsData } from '@root/runner/zaps/zaps.runner.dto';

@Injectable()
export class RunnerService {
  private logger = new Logger('workflow');

  constructor(private zapRunnerService: ZapsRunnerService) {}

  /**
   * Start the runner of the AREA.
   *
   * This method call the `TriggerJobRunner#`
   */
  async start() {
    while (true) {
      const zaps = await this.zapRunnerService.getAllZaps();

      for (const zap of zaps) {
        if (!zap.is_active) continue;
        try {
          const triggerResult = await this.zapRunnerService.isTriggered(zap);
          if (!triggerResult.result.is_triggered) continue;

          const jobsData: ZapJobsData = {
            [triggerResult.id]: {
              data: triggerResult.result.data,
              status: triggerResult.result.status,
            },
          };
          await this.zapRunnerService.executeActionsOf(zap, jobsData);
        } catch (e) {
          this.logger.error((e as Error).message);
        }
      }
    }
  }
}
