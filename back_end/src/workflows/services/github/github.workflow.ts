import { CheckResult, TriggerJob } from '@root/workflows/workflows.dto';

export default class GithubTrigger_OnNewRepository implements TriggerJob {
  public async check(
    access_token: string,
    payload: object,
  ): Promise<CheckResult> {
    return {
      data: [],
      is_triggered: false,
    };
  }
}
