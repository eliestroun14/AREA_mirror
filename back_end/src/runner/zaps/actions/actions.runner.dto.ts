import { connections, actions, zap_steps, http_requests } from '@prisma/client';
import { RunnerExecutionStatus, RunnerVariableData } from '@root/runner/runner.dto';

interface ActionRunnerDTO extends actions {
  http_requests: http_requests | null;
}

export interface ActionStepRunnerDTO extends zap_steps {
  action: ActionRunnerDTO | null;
  connection: connections | null;
}

export interface ActionRunResult {
  status: RunnerExecutionStatus;
  data: RunnerVariableData[];
}
