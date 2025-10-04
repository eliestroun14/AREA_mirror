import { StepDTO } from '@app/zaps/steps/steps.dto';

export interface StepData {
  key: string;
  value: string;
}

export type StepsData = Record<number, StepData[] | null>;

export interface CheckResult {
  is_triggered: boolean;
  data: StepData[];
}

export interface RunResult {
  has_run: boolean;
  data: StepData[];
}

export abstract class TriggerJob {
  public abstract check: (
    access_token: string,
    payload: object,
  ) => Promise<CheckResult>;
}

export abstract class ActionJob {
  public abstract run: (
    access_token: string,
    payload: object,
  ) => Promise<RunResult>;
}
