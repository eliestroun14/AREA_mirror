import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { servicesData } from './services-data/services.data';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private static isInit = false;

  async onModuleInit() {
    await this.$connect();

    if (PrismaService.isInit) return;

    for (const service of servicesData) {
      const serviceData = await this.services.findFirst({
        where: {
          name: service.name,
        },
      });

      const data = {
        name: service.name,
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
        await this.services.create({ data });
      }
    }
    PrismaService.isInit = true;
  }
}
