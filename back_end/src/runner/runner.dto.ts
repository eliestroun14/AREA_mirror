export interface RunnerVariableData {
  key: string;
  value: string;
}

export interface RunnerCheckResult<ComparisonDataType> {
  status: RunnerExecutionStatus;
  is_triggered: boolean;
  variables: RunnerVariableData[];
  comparison_data: ComparisonDataType | null;
}

export enum RunnerExecutionStatus {
  SUCCESS,
  FAILURE,
}

export interface RunnerExecutionResult {
  variables: RunnerVariableData[];
  status: RunnerExecutionStatus;
}
