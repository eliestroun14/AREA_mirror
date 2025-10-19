import { CheckResult } from '@root/workflows/workflows.dto';
import { TriggerBuilderParams } from '@root/workflows/runner/zaps/triggers/triggers.runner.factory';
import { TriggerRunnerJob } from '@root/workflows/runner/zaps/triggers/triggers.runner.job';

export class ScheduleTrigger_EveryMinutes extends TriggerRunnerJob<object> {
  constructor(params: TriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<CheckResult> {
    return {
      data: [],
      is_triggered: true,
    };
  }
}
