import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { WorkflowService } from '@root/workflows/workflows.service';
import { TRIGGERS } from '@root/workflows/workflows.registers';
import { ZapsService } from '@app/zaps/zaps.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private workflowService: WorkflowService,
    private zapsService: ZapsService,
  ) {}

  @Post('github')
  async githubWebhook(
    @Headers() headers: object,
    @Body() body: object,
    @Param() param: object,
  ) {
    const event =
      'x-github-event' in headers ? headers['x-github-event'] : null;
    const action = 'action' in body ? body['action'] : null;

    if (!event || !action) return { status: 'KO' };

    const zaps = this.zapsService.getAllZaps();
    for (const className in TRIGGERS) {
      const trigger = TRIGGERS[className];
      if (trigger.event === event && trigger.action === action) {
        const triggerClass = new trigger.class();
        const checkResult = await triggerClass.check(null, body);

        if (checkResult.is_triggered) {
          console.log('Execute actions of trigger !');
        }
      }
    }

    return {
      status: 'OK',
    };
  }
}
