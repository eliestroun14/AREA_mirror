import { constants } from '@config/utils';
import { TriggerStepRunnerDTO } from '@root/runner/zaps/triggers/triggers.runner.dto';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import JsonValueParser from '@root/runner/parser/json-value.parser';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import { zaps } from '@prisma/client';
import { TriggersRunnerFactory } from '@root/runner/zaps/triggers/triggers.runner.factory';

@Injectable()
export class TriggersRunnerService {
  constructor(
    private prisma: PrismaService,
    private triggerFactory: TriggersRunnerFactory,
  ) {}

  public async getTriggerClassOf(
    zap: zaps,
    triggerStep: TriggerStepRunnerDTO,
  ): Promise<PollTrigger<any, any> | null> {
    const trigger = triggerStep.trigger;
    return this.triggerFactory.build(trigger.class_name, {
      stepId: triggerStep.id,
      triggerType: trigger.trigger_type,
      lastExecution: zap.last_run_at,
      lastComparisonData: zap.last_trigger_data
        ? JsonValueParser.parse<object>(zap.last_trigger_data)
        : null,
      executionInterval: trigger.polling_interval,
      accessToken: triggerStep.connection?.access_token ?? null,
      payload: JsonValueParser.parse(triggerStep.payload),
    });
  }

  public async getTriggerStepOf(
    zapId: number,
  ): Promise<TriggerStepRunnerDTO | null> {
    const step = await this.prisma.zap_steps.findFirst({
      where: {
        zap_id: zapId,
        OR: [{ step_order: 0 }, { step_type: constants.step_types.trigger }],
      },
      include: {
        trigger: true,
        connection: true,
      },
    });

    if (!step || !step.trigger) return null;

    return {
      ...step,
      trigger: step.trigger,
      connection: step.connection,
    };
  }
}
