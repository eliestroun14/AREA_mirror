import { TriggerRunnerJob } from '@root/runner/zaps/triggers/triggers.runner.job';
import { ScheduleTrigger_EveryMinutes } from '@root/runner/services/schedule/schedule.workflow';
import JobNotFoundError from '@root/runner/errors/job-not-found.error';

export interface TriggerBuilderParams {
  stepId: number;
  triggerType: string;
  lastExecution: Date | null;
  executionInterval: number | null;
  accessToken: string | null;
  payload: object;
}

type TriggerBuilderFunction = (
  builder: TriggerBuilderParams,
) => TriggerRunnerJob<any>;

export class TriggersRunnerFactory {
  private registers: Record<string, TriggerBuilderFunction> = {
    ScheduleTrigger_EveryMinutes: (builder: TriggerBuilderParams) => {
      return new ScheduleTrigger_EveryMinutes(builder);
    },
  };

  /**
   * Build a class of the specified trigger's class name.
   * @param className The name of the class to build.
   * @param builderParams The parameters required to build the class.
   */
  build(
    className: string,
    builderParams: TriggerBuilderParams,
  ): TriggerRunnerJob<any> {
    if (!(className in this.registers))
      throw new JobNotFoundError(builderParams.stepId, className, 'trigger');
    return this.registers[className](builderParams);
  }
}
