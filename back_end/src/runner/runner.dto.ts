export interface RunnerVariableData {
  key: string;
  value: string;
}

export interface RunnerCheckResult {
  status: RunnerExecutionStatus;
  is_triggered: boolean;
  data: RunnerVariableData[];
}

export enum RunnerExecutionStatus {
  SUCCESS,
  FAILURE,
}

export interface RunnerExecutionResult {
  data: RunnerVariableData[];
  status: RunnerExecutionStatus;
}
