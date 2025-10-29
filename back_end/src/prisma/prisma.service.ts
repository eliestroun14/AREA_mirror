import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { servicesData } from './services-data/services.data';
import {
  Service,
  ServiceAction,
  ServiceHttpRequest,
  ServiceTrigger,
  ServiceTriggerWebhook,
} from './services-data/services.dto';
import { connect } from 'rxjs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private static isInit = false;

  async onModuleInit() {
    await this.$connect();

    if (PrismaService.isInit) return;

    await this.deleteAllTriggers();
    await this.deleteAllActions();
    await this.deleteAllWebhooks();
    await this.deleteAllHttpRequests();

    for (const service of servicesData) {
      const serviceId = await this.createService(service);

      for (const trigger of service.triggers) {
        // let webhookId: number | null = null;
        let httpRequestId: number | null = null;

        // if (trigger.webhook)
        //   webhookId = await this.createTriggerWebhook(trigger.webhook);
        if (trigger.http_requests)
          httpRequestId = await this.createHttpRequest(trigger.http_requests);

        await this.createTrigger(
          trigger,
          serviceId,
          httpRequestId,
          // webhookId,
        );
      }
      for (const action of service.actions) {
        const httpRequestId = await this.createHttpRequest(
          action.http_requests,
        );
        await this.createAction(action, serviceId, httpRequestId);
      }
    }
    PrismaService.isInit = true;
  }

  private async createService(service: Service): Promise<number> {
    let serviceData = await this.services.findFirst({
      where: {
        name: service.name,
      },
    });

    const data = {
      name: service.name,
      slug: service.slug,
      service_color: service.serviceColor,
      icon_url: service.iconUrl,
      api_base_url: service.apiBaseUrl,
      auth_type: service.authType,
      documentation_url: service.documentationUrl,
      is_active: service.isActive,
    };

    if (serviceData) {
      await this.services.update({ where: { name: service.name }, data });
    } else {
      serviceData = await this.services.create({ data });
    }

    return serviceData.id;
  }

  private async deleteAllTriggers(): Promise<void> {
    await this.triggers.deleteMany();
  }

  private async deleteAllActions(): Promise<void> {
    await this.actions.deleteMany();
  }

  private async deleteAllHttpRequests(): Promise<void> {
    await this.http_requests.deleteMany();
  }

  private async deleteAllWebhooks(): Promise<void> {
    await this.webhooks.deleteMany();
  }

  private async createTrigger(
    trigger: ServiceTrigger,
    serviceId: number,
    httpRequestId: number | null,
    // webhookId: number | null,
  ): Promise<void> {
    const data: Prisma.triggersCreateInput = {
      class_name: trigger.class_name,
      trigger_type: trigger.trigger_type,
      name: trigger.name,
      description: trigger.description,
      require_connection: trigger.require_connection,
      fields: trigger.fields as object,
      variables: trigger.variables as object,
      polling_interval: trigger.polling_interval,
      service: {
        connect: {
          id: serviceId,
        },
      },
    };

    if (httpRequestId) data.http_requests = { connect: { id: httpRequestId } };
    // if (webhookId) data.webhook = { connect: { id: webhookId } };

    await this.triggers.create({ data });
  }

  private async createAction(
    action: ServiceAction,
    serviceId: number,
    httpRequestId: number,
  ): Promise<void> {
    const data: Prisma.actionsCreateInput = {
      class_name: action.class_name,
      name: action.name,
      description: action.description,
      require_connection: action.require_connection,
      http_requests: { connect: { id: httpRequestId } },
      fields: action.fields as object,
      variables: action.variables as object,
      service: { connect: { id: serviceId } },
    };

    await this.actions.create({ data });
  }

  private async createHttpRequest(
    httpRequest: ServiceHttpRequest,
  ): Promise<number> {
    const data: Prisma.http_requestsCreateInput = {
      description: httpRequest.description,
      endpoint: httpRequest.endpoint,
    };

    const httpRequestData = await this.http_requests.create({ data });
    return httpRequestData.id;
  }

  private async createTriggerWebhook(
    webhook: ServiceTriggerWebhook,
  ): Promise<number> {
    const data: Prisma.webhooksCreateInput = {
      event: webhook.event,
      action: webhook.action,
      from_url: webhook.from_url,
      // secret: webhook.secret,
    };

    const webhookData = await this.webhooks.create({ data });
    return webhookData.id;
  }
}
