import { RunnerCheckResult, RunnerExecutionStatus } from '@root/runner/runner.dto';
import { TriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { TriggerRunnerJob } from '@root/runner/zaps/triggers/triggers.runner.job';

export class ScheduleTrigger_EveryMinutes extends TriggerRunnerJob<object> {
  constructor(params: TriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<RunnerCheckResult> {
    return {
      status: RunnerExecutionStatus.SUCCESS,
      data: [],
      is_triggered: true,
    };
  }
}
