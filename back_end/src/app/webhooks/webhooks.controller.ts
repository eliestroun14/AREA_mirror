import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { RunnerService } from '@root/runner/runner.service';
import { RunnerVariableData } from '@root/runner/runner.dto';
import { ZapsRunnerService } from '@root/runner/zaps/zaps.runner.service';

export abstract class AREA_WebhookController {
  protected constructor(
    protected workflowService: RunnerService,
    protected zapRunnerService: ZapsRunnerService,
  ) {}

  protected abstract getVariablesData(
    headers: object,
    body: object,
    queries: object,
  ): RunnerVariableData[];

  protected verify(headers: object, body: object, queries: object): boolean {
    return true;
  }

  @Post(`:userId/:zapId/:triggerStepId`)
  async trigger(
    @Headers() headers: object,
    @Body() body: object,
    @Query() queries: object,
    @Param('userId') paramUserId: string,
    @Param('zapId') paramZapId: string,
    @Param('triggerStepId') paramTriggerStepId: string,
  ) {
    const userId = Number(paramUserId);
    const zapId = Number(paramZapId);
    const triggerStepId = Number(paramTriggerStepId);
    if (isNaN(userId))
      throw new BadRequestException(`Invalid id: ${paramUserId}.`);
    if (isNaN(zapId))
      throw new BadRequestException(`Invalid id: ${paramZapId}.`);
    if (isNaN(triggerStepId))
      throw new BadRequestException(`Invalid id: ${paramTriggerStepId}.`);

    const zap = await this.zapRunnerService.getZap(zapId, userId);

    if (!zap || !zap.is_active)
      return {
        message: 'Error: Either the zap do not exists or it is disabled.',
      };

    if (this.verify(headers, body, queries)) {
      const data = this.getVariablesData(headers, body, queries);
      await this.workflowService.runWebhookActions(zap, triggerStepId, data);
    }

    return {
      message: 'Done.',
    };
  }
}
