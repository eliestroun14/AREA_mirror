import { InternalServerErrorException } from '@nestjs/common';

export class WebhookTrigger {
  static hook(
    webhookUrl: string,
    secret: string,
    payload: object,
    accessToken: string,
  ): Promise<boolean> {
    throw new InternalServerErrorException(
      `Webhook not configured yet. Please retry later.`,
    );
  }
}
