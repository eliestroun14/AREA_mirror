import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import { ZapsService } from '@app/zaps/zaps.service';
import { TriggersService } from '@app/services/triggers/triggers.service';
import DiscordAction_SendMessage from '@root/workflows/services/discord/discord.workflow';
import { ZapDTO } from '@app/zaps/zaps.dto';
import { Logger } from '@root/workflows/logger/logger';
import {
  ActionJob,
  StepData,
  StepsData,
  TriggerJob,
  RunResult,
} from '@root/workflows/workflows.dto';
import { constants } from '@config/utils';
import { triggers, zap_steps } from '@prisma/client';
import { ActionsService } from '@app/services/actions/actions.service';
import GithubTrigger_OnNewRepository
  from '@root/workflows/services/github/github.workflow';

@Injectable()
export class WorkflowService {
  private TRIGGERS: Record<string, new () => TriggerJob> = {
    GithubTrigger_OnNewRepository: GithubTrigger_OnNewRepository,
  };
  private ACTIONS: Record<string, new () => ActionJob> = {
    DiscordAction_SendMessage: DiscordAction_SendMessage,
  };
  private logger = new Logger('workflow');

  constructor(
    private prisma: PrismaService,
    private zapsService: ZapsService,
    private triggersService: TriggersService,
    private actionsService: ActionsService,
  ) {}

  async run() {
    while (true) {
      const zaps = await this.zapsService.getAllZaps();

      for (const zap of zaps) {
        if (!zap.is_active) continue;
        this.logger.log(`Executing zap '${zap.name}:${zap.id}'.`);
        this.executeZap(zap)
          .then(() => {
            this.logger.success(
              `Zap ${zap.name}:${zap.id}' successfully executed.`,
            );
          })
          .catch((err: Error) => {
            this.logger.error(
              `Zap '${zap.name}:${zap.id}' ended by an error: ${err.message}`,
            );
          });
      }
    }
  }

  private async executeZap(zap: ZapDTO) {
    const triggerStep = await this.getTriggerStepOf(zap.id);
    if (!triggerStep || !triggerStep.trigger_id) {
      this.logger.warn(
        `Trigger of zap '${zap.name}:${zap.id}' with id is not set. Skipping...`,
      );
      return;
    }

    const trigger = await this.triggersService.getTriggerById(
      triggerStep.trigger_id,
    );
    if (!trigger)
      throw new Error(`Trigger of zap '${zap.name}:${zap.id}' do not exists.`);
    if (!(trigger.class_name in this.TRIGGERS))
      throw new Error(
        `Trigger of zap '${zap.name}:${zap.id}' do not have a valid class_name.`,
      );
    if (!(await this.checkIfReadyToTrigger(zap.id, trigger))) return;

    const triggerAccessToken = await this.getAccessToken(
      triggerStep.connection_id,
    );
    if (!triggerAccessToken)
      throw new Error(
        `Connection account not found for step with id ${triggerStep.id}`,
      );

    const stepsVariables: StepsData = {};
    const job: TriggerJob = new this.TRIGGERS[trigger.class_name]();

    const zapExecutionId = await this.startZapExecution(zap.id);
    const zapStart = Date.now();
    const triggerExecutionId = await this.startStepExecution(
      triggerStep.id,
      zapExecutionId,
    );
    const triggerStart = Date.now();
    const result = await job.check(
      triggerAccessToken,
      triggerStep.payload as object,
    );
    await this.finishStepExecution(
      triggerExecutionId,
      result.data,
      Date.now() - triggerStart,
    );

    stepsVariables[triggerStep.id] = result.data;
    if (!result.is_triggered) {
      await this.finishZapExecution(zapExecutionId, Date.now() - zapStart);
    } else {
      await this.executeActions(zap, stepsVariables, zapExecutionId);
      await this.finishZapExecution(zapExecutionId, Date.now() - zapStart);
    }
  }

  private async executeActions(
    zap: ZapDTO,
    data: StepsData,
    zapExecutionId: number,
  ) {
    const zap_step: zap_steps[] = await this.getActionStepsOf(zap.id);

    for (const actionStep of zap_step) {
      if (!actionStep.source_step_id) {
        this.logger.error(
          `Action step with id '${actionStep.id}' do not have a source_step_id.`,
        );
        return;
      }

      const sourceStepData = data[actionStep.source_step_id];
      if (!sourceStepData) {
        this.logger.error(
          `Action step with id '${actionStep.id}' cannot be executed due to its dependent step '${actionStep.source_step_id}'.`,
        );
        return;
      }

      const stepExecutionId = await this.startStepExecution(
        actionStep.id,
        zapExecutionId,
      );
      const stepStart = Date.now();

      const result = await this.runAction(actionStep, sourceStepData);
      if (!result) data[actionStep.id] = null;
      else data[actionStep.id] = result.data;

      await this.finishStepExecution(
        stepExecutionId,
        result.data,
        Date.now() - stepStart,
      );
    }
  }

  private async runAction(
    step: zap_steps,
    sourceData: StepData[],
  ): Promise<RunResult> {
    if (!step.action_id) {
      this.logger.warn(
        `Action of the step with id '${step.id}' do not exists. Skipping...`,
      );
      return { has_run: false, data: [] };
    }

    const action = await this.actionsService.getActionById(step.action_id);
    if (!action) {
      this.logger.warn(
        `Action with id '${step.action_id}' do not exists. Skipping...`,
      );
      return { has_run: false, data: [] };
    }
    if (!(action.class_name in this.TRIGGERS)) {
      this.logger.error(
        `Action of zap '${action.name}:${step.zap_id}' do not have a valid class_name.`,
      );
      return { has_run: false, data: [] };
    }

    const accessToken = await this.getAccessToken(step.connection_id);
    if (!accessToken) {
      this.logger.error(
        `Action of zap '${action.name}:${step.zap_id}' do not have a valid connection.`,
      );
      return { has_run: false, data: [] };
    }

    const payload = step.payload as { [key: string]: string };
    for (const key in payload) {
      for (const data of sourceData)
        payload[key] = payload[key].replaceAll(data.key, data.value);
    }
    const job = new this.ACTIONS[action.class_name]();
    return await job.run(accessToken, payload);
  }

  private async getTriggerStepOf(zapId: number): Promise<zap_steps | null> {
    return await this.prisma.zap_steps.findFirst({
      where: {
        zap_id: zapId,
        OR: [{ step_order: 0 }, { step_type: constants.step_types.trigger }],
      },
    });
  }

  private async getActionStepsOf(zapId: number): Promise<zap_steps[]> {
    return await this.prisma.zap_steps.findMany({
      where: {
        zap_id: zapId,
        OR: [{ step_order: 0 }, { step_type: constants.step_types.action }],
      },
    });
  }

  private async getAccessToken(connectionId: number): Promise<string | null> {
    const connection = await this.prisma.connections.findFirst({
      where: { id: connectionId },
    });
    return connection ? connection.access_token : null;
  }

  private async checkIfReadyToTrigger(zapId: number, trigger: triggers) {
    if (
      trigger.trigger_type === constants.trigger_types.polling &&
      trigger.polling_interval !== null
    ) {
      const interval = trigger.polling_interval;
      const lastExecutions = await this.prisma.zap_executions.findMany({
        where: { id: zapId },
        orderBy: {
          ended_at: 'desc',
        },
        take: 1,
      });

      if (lastExecutions.length === 0 || !lastExecutions[0].ended_at)
        return false;

      return lastExecutions[0].ended_at.getTime() - Date.now() > interval;
    }
    return false;
  }

  private async startStepExecution(
    stepId: number,
    zapExecutionId: number,
  ): Promise<number> {
    const stepExecution = await this.prisma.zap_step_executions.create({
      data: {
        zap_step_id: stepId,
        zap_execution_id: zapExecutionId,
        data: {},
        status: constants.execution_status.in_progress,
        duration_ms: 0,
        started_at: new Date(Date.now()),
      },
    });

    return stepExecution.id;
  }

  private async finishStepExecution(
    id: number,
    data: object,
    duration_ms: number,
    error?: { message: string; code: string },
  ): Promise<void> {
    await this.prisma.zap_step_executions.update({
      where: { id },
      data: {
        data,
        duration_ms,
        error,
        status:
          error === null
            ? constants.execution_status.done
            : constants.execution_status.failed,
        ended_at: new Date(Date.now()),
      },
    });
  }

  private async finishZapExecution(
    id: number,
    duration_ms: number,
  ): Promise<void> {
    await this.prisma.zap_executions.update({
      where: { id },
      data: {
        status: constants.execution_status.done,
        ended_at: new Date(Date.now()),
        duration_ms,
      },
    });
  }

  private async startZapExecution(zapId: number): Promise<number> {
    const zapExecution = await this.prisma.zap_executions.create({
      data: {
        zap_id: zapId,
        status: constants.execution_status.in_progress,
        duration_ms: 0,
        started_at: new Date(Date.now()),
      },
    });
    return zapExecution.id;
  }
}
