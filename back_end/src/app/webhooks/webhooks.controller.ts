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

  @Post(`:userId/:zapId/:triggerId`)
  async trigger(
    @Headers() headers: object,
    @Body() body: object,
    @Query() queries: object,
    @Param('userId') paramUserId: string,
    @Param('zapId') paramZapId: string,
    @Param('triggerId') paramTriggerId: string,
  ) {
    const userId = Number(paramUserId);
    const zapId = Number(paramZapId);
    const triggerId = Number(paramTriggerId);
    if (isNaN(userId))
      throw new BadRequestException(`Invalid id: ${paramUserId}.`);
    if (isNaN(zapId))
      throw new BadRequestException(`Invalid id: ${paramZapId}.`);
    if (isNaN(triggerId))
      throw new BadRequestException(`Invalid id: ${paramTriggerId}.`);

    const zap = await this.zapRunnerService.getZap(zapId, userId);

    if (!zap || !zap.is_active)
      return {
        message: 'Error: Either the zap do not exists or it is disabled.',
      };

    // Le user crée son step trigger, ça fait une requête pour créer le webhook
    // Puis quand le webhook fait un call api vers cette route, ça fait les checks etc.. Et ça lance ou non le trigger.
    // TODO: Revoir le getVariablesData si on peut pas ajouter un typage en mode <VariableDataType> ou un truc comme ça ?
    const data = this.getVariablesData(headers, body, queries);
    await this.workflowService.runWebhookActions(zap, triggerId, data);

    return {
      message: 'Done.',
    };
  }
}
