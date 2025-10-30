import { constants } from '@config/utils';
import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';

export abstract class PollTrigger<PayloadType, ComparisonDataType> {
  private readonly _stepId: number;
  private readonly _triggerType: string;
  private readonly _executionInterval: number | null;
  protected readonly lastExecution: Date | null;
  protected readonly accessToken: string | null;
  protected readonly payload: PayloadType;
  protected readonly lastComparisonData: ComparisonDataType | null;

  protected constructor(params: PollTriggerBuilderParams) {
    this._stepId = params.stepId;
    this._triggerType = params.triggerType;
    this._executionInterval = params.executionInterval;
    this.lastExecution = params.lastExecution;
    this.lastComparisonData =
      params.lastComparisonData as ComparisonDataType | null;
    this.accessToken = params.accessToken;
    this.payload = params.payload as PayloadType;
  }

  protected abstract _check(): Promise<RunnerCheckResult<ComparisonDataType>>;

  public getStepId(): number {
    return this._stepId;
  }

  public async check(): Promise<RunnerCheckResult<ComparisonDataType>> {
    const currentTimestamp = Date.now();
    const lastExecutionTimestamp = this.lastExecution?.getTime();

    const isPolling = this._triggerType === constants.trigger_types.polling;
    const hasAlreadyBeenTriggered = this.lastExecution !== null;
    const hasExecutionIntervalData = this._executionInterval !== null;

    const failureData: RunnerCheckResult<ComparisonDataType> = {
      variables: [],
      comparison_data: null,
      is_triggered: false,
      status: RunnerExecutionStatus.FAILURE,
    };

    if (!isPolling) return this._check();
    if (isPolling && !hasAlreadyBeenTriggered) return this._check();
    if (
      hasExecutionIntervalData &&
      hasAlreadyBeenTriggered &&
      lastExecutionTimestamp &&
      currentTimestamp - lastExecutionTimestamp > this._executionInterval
    )
      return this._check();

    return failureData;
  }
}
