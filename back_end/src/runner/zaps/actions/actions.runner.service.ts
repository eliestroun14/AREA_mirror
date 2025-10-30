import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import { constants } from '@config/utils';
import { ZapJobsData } from '@root/runner/zaps/zaps.runner.dto';
import {
  ActionRunResult,
  ActionStepRunnerDTO,
} from '@root/runner/zaps/actions/actions.runner.dto';
import MissingStepDataError from '@root/runner/errors/missing-step-data.error';
import { ActionsRunnerFactory } from '@root/runner/zaps/actions/actions.runner.factory';
import { ActionExecutor } from '@root/runner/zaps/actions/actions.runner.job';
import StepActionNotFoundError from '@root/runner/errors/step-action-not-found.error';
import JsonValueParser from '@root/runner/parser/json-value.parser';
import MissingStepActionIdError from '@root/runner/errors/missing-step-action-id.error';
import { RunnerExecutionStatus } from '@root/runner/runner.dto';

@Injectable()
export class ActionsRunnerService {
  constructor(
    private prisma: PrismaService,
    private actionFactory: ActionsRunnerFactory,
  ) {}

  public async getAllActionsOf(zapId: number): Promise<ActionStepRunnerDTO[]> {
    const actionsSteps = await this.prisma.zap_steps.findMany({
      where: {
        zap_id: zapId,
        step_type: constants.step_types.action,
      },
      orderBy: {
        step_order: 'asc',
      },
      include: {
        connection: true,
        action: {
          include: { http_requests: true },
        },
      },
    });

    return actionsSteps.map((step) => {
      return {
        ...step,
        action: step.action,
        connection: step.connection,
      };
    });
  }

  /**
   * Execute a single action of a zap.
   * @param actionStep
   * @param jobsData
   */
  public async executeAction(
    actionStep: ActionStepRunnerDTO,
    jobsData: ZapJobsData,
  ): Promise<ActionRunResult> {
    if (!actionStep.source_step_id)
      return {
        variables: [],
        status: RunnerExecutionStatus.FAILURE,
      };

    if (!(actionStep.source_step_id in jobsData))
      throw new MissingStepDataError(
        actionStep.zap_id,
        actionStep.id,
        actionStep.source_step_id,
      );

    const actionClass = this.getClass(actionStep);
    return actionClass.execute(jobsData[actionStep.source_step_id].variables);
  }

  /**
   * Get the class of a specific step of a zap.
   * @param actionStep The step associated to the class.
   * @private
   */
  private getClass(actionStep: ActionStepRunnerDTO): ActionExecutor<any> {
    const action = actionStep.action;

    if (!actionStep.action_id)
      throw new MissingStepActionIdError(actionStep.zap_id, actionStep.id);
    if (!action)
      throw new StepActionNotFoundError(actionStep.id, actionStep.action_id);

    return this.actionFactory.build(action.class_name, {
      stepId: actionStep.id,
      accessToken: actionStep.connection?.access_token ?? null,
      payload: JsonValueParser.parse(actionStep.payload),
    });
  }
}
