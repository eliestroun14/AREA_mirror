import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { RunnerService } from '@root/runner/runner.service';
import { ZapsService } from '@app/zaps/zaps.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private workflowService: RunnerService,
    private zapsService: ZapsService,
  ) {}
}
