import { zap_steps, triggers, connections } from '@prisma/client';
import { TriggerRunnerJob } from '@root/runner/zaps/triggers/triggers.runner.job';

export interface TriggerStepRunnerDTO extends zap_steps {
  trigger: triggers;
  connection: connections | null;
}

export type TriggerRegister = {
  className: string;
  class: new (
    stepId: number,
    triggerType: string,
    lastExecution: Date | null,
    executionInterval: number | null,
    accessToken: string | null,
    payload: any,
  ) => TriggerRunnerJob<any, any>;
  event: string;
  action: string;
};
