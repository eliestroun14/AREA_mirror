import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import { ScheduleTrigger_EveryMinutes_Payload } from '@root/runner/services/schedule/schedule.dto';

export class ScheduleTrigger_EveryMinutes extends PollTrigger<
  ScheduleTrigger_EveryMinutes_Payload,
  any
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<RunnerCheckResult<any>> {
    const lastExecutionTimestamp = this.lastExecution?.getTime();
    const now = Date.now();
    const data = [{ key: 'Date', value: new Date(now).toISOString() }];

    if (!this.lastExecution)
      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: data,
        comparison_data: {},
        is_triggered: true,
      };

    if (
      lastExecutionTimestamp &&
      now - lastExecutionTimestamp >= Number(this.payload.seconds) * 1000
    )
      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: data,
        comparison_data: {},
        is_triggered: true,
      };
    return {
      status: RunnerExecutionStatus.SUCCESS,
      variables: [],
      comparison_data: {},
      is_triggered: false,
    };
  }
}
