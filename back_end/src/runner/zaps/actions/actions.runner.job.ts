import { RunnerVariableData } from '@root/runner/runner.dto';
import { ActionBuilderParams } from '@root/runner/zaps/actions/actions.runner.factory';
import { ActionRunResult } from '@root/runner/zaps/actions/actions.runner.dto';

export abstract class ActionExecutor<PayloadType extends Record<string, any>> {
  private readonly _stepId: number;
  protected readonly accessToken: string | null;
  private readonly payload: PayloadType;

  public constructor(params: ActionBuilderParams) {
    this._stepId = params.stepId;
    this.accessToken = params.accessToken;
    this.payload = params.payload as PayloadType;
  }

  protected abstract _execute(payload: PayloadType): Promise<ActionRunResult>;

  public getStepId(): number {
    return this._stepId;
  }

  public async execute(
    variablesData: RunnerVariableData[],
  ): Promise<ActionRunResult> {
    const payload = { ...this.payload } as Record<string, any>;

    for (const [key, value] of Object.entries(this.payload)) {
      if (typeof value === 'string')
        payload[key] = this.applyVariables(variablesData, value);
    }
    return this._execute(payload as PayloadType);
  }

  private applyVariables(
    variablesData: RunnerVariableData[],
    value: string,
  ): string {
    for (const data of variablesData) {
      value = value.replaceAll(`{{${data.key}}}`, data.value);
    }
    return value;
  }
}
