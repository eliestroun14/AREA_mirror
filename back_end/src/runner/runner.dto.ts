export interface VariableData {
  key: string;
  value: string;
}

export interface CheckResult {
  status: RunnerExecutionStatus;
  is_triggered: boolean;
  data: VariableData[];
}

export enum RunnerExecutionStatus {
  SUCCESS,
  FAILURE,
}

export interface RunnerExecutionResult {
  data: VariableData[];
  status: RunnerExecutionStatus;
}
