import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { TriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { TriggerRunnerJob } from '@root/runner/zaps/triggers/triggers.runner.job';
import { ScheduleTrigger_EveryMinutes_Payload } from '@root/runner/services/schedule/schedule.dto';

export class ScheduleTrigger_EveryMinutes extends TriggerRunnerJob<ScheduleTrigger_EveryMinutes_Payload> {
  constructor(params: TriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<RunnerCheckResult> {
    const lastExecutionTimestamp = this.lastExecution?.getTime();
    const now = Date.now();
    const data = [{ key: 'Date', value: new Date(now).toISOString() }];

    if (!this.lastExecution)
      return {
        status: RunnerExecutionStatus.SUCCESS,
        data,
        is_triggered: true,
      };

    if (
      lastExecutionTimestamp &&
      now - lastExecutionTimestamp >= Number(this.payload.seconds) * 1000
    )
      return {
        status: RunnerExecutionStatus.SUCCESS,
        data,
        is_triggered: true,
      };
    return {
      status: RunnerExecutionStatus.SUCCESS,
      data: [],
      is_triggered: false,
    };
  }
}
