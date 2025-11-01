import { AREA_WebhookController } from '@app/webhooks/webhooks.controller';
import { RunnerVariableData } from '@root/runner/runner.dto';
import { WebhookController } from '@app/webhooks/webhooks.dto';
import { RunnerService } from '@root/runner/runner.service';
import { ZapsRunnerService } from '@root/runner/zaps/zaps.runner.service';
import {
  YoutubeNewVideoUploadHeaders, // Modifiez le type dans 'youtube-new-video-upload.dto.ts'.
  YoutubeNewVideoUploadBody, // Modifiez le type dans 'youtube-new-video-upload.dto.ts'.
  YoutubeNewVideoUploadQueries, // Modifiez le type dans 'youtube-new-video-upload.dto.ts'.
} from '@root/services/youtube/triggers/new-video-upload/youtube-new-video-upload.dto';

@WebhookController('youtube/new-video-upload')
export class YoutubeNewVideoUploadWebhookController extends AREA_WebhookController {
  constructor(
    workflowService: RunnerService,
    zapRunnerService: ZapsRunnerService,
  ) {
    super(workflowService, zapRunnerService);
  }

  protected getVariablesData(
    headers: YoutubeNewVideoUploadHeaders,
    body: YoutubeNewVideoUploadBody,
    queries: YoutubeNewVideoUploadQueries,
  ): RunnerVariableData[] {
    return [];
  }
}
