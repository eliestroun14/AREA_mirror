import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { RunnerService } from '@root/runner/runner.service';
import { ZapsService } from '@app/zaps/zaps.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private workflowService: RunnerService,
    private zapsService: ZapsService,
  ) {}

  // @Post('github')
  // async githubWebhook(
  //   @Headers() headers: object,
  //   @Body() body: object,
  //   @Param() param: object,
  // ) {
  //   console.log('New repository created!');
  //   console.log('body:', body);
  //
  //   const event =
  //     'x-github-event' in headers ? headers['x-github-event'] : null;
  //   const action = 'action' in body ? body['action'] : null;
  //
  //   if (!event || !action) return { status: 'KO' };
  //
  //   const zaps = this.zapsService.getAllZaps();
  //   for (const className in TRIGGERS) {
  //     const trigger = TRIGGERS[className];
  //     if (trigger.event === event && trigger.action === action) {
  //       const triggerClass = new trigger.class();
  //       const checkResult = await triggerClass.check(null, body);
  //
  //       if (checkResult.is_triggered) {
  //         console.log('Execute actions of trigger !');
  //       }
  //     }
  //   }
  //
  //   return {
  //     status: 'OK',
  //   };
  // }
}
