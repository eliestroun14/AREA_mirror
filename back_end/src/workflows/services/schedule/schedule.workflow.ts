import { CheckResult, TriggerJob } from '@root/workflows/workflows.dto';

export class ScheduleTrigger_EveryMinutes implements TriggerJob {
  public async check(
    access_token: string | null,
    payload: object,
  ): Promise<CheckResult> {
    return {
      data: [],
      is_triggered: true,
    };
  }
}
