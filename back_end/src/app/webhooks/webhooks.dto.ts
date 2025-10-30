import { Controller } from '@nestjs/common';

export const WebhookController = (subpath = ''): ClassDecorator =>
  Controller(subpath ? `webhooks/${subpath}` : 'webhooks');
