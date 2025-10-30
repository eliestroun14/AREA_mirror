import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import {
  constants,
  getTriggerFromServicesData,
  webhookUrlOf,
} from '@config/utils';
import { servicesData } from '@root/prisma/services-data/services.data';
import { triggers, services } from '@prisma/client';
import { randomUUID } from 'node:crypto';

@Injectable()
export class WebhooksService {
  constructor(private prisma: PrismaService) {}

  public async createWebhookFromTriggerStep(
    userId: number,
    zapId: number,
    triggerStepId: number,
    dbTrigger: triggers,
    dbService: services,
    payload: object,
    accessToken: string,
  ): Promise<number | null> {
    if (dbTrigger.trigger_type === constants.trigger_types.webhook) {
      const serviceTrigger = getTriggerFromServicesData(dbTrigger);

      if (serviceTrigger !== null && serviceTrigger.webhook !== null) {
        const secret = randomUUID();
        const isHooked = await serviceTrigger.webhook.hook(
          webhookUrlOf(
            dbService.slug,
            serviceTrigger.webhook.slug,
            userId,
            zapId,
            triggerStepId,
          ),
          secret,
          payload,
          accessToken,
        );

        if (!isHooked)
          throw new InternalServerErrorException(
            `Cannot hook your trigger with this service. Please retry later.`,
          );

        const webhook = await this.prisma.webhooks.create({
          data: { secret },
        });
        return webhook.id;
      }
    }
    return null;
  }
}
