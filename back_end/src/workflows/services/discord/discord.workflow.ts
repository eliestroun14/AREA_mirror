import { StepDTO } from '@root/app/zaps/steps/steps.dto';
import {
  ActionJob,
  CheckResult,
  RunResult,
  TriggerJob,
} from '@root/workflows/workflows.dto';

export default class DiscordAction_SendMessage implements ActionJob {
  public async run(accessToken: string, payload: object): Promise<RunResult> {
    return {
      data: [],
      has_run: false,
    };
  }
}
