import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { services } from '@app/auth/services';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    for (const service of services) {
      const serviceData = await this.services.findFirst({
        where: {
          name: service.name,
        },
      });

      if (serviceData) continue;

      await this.services.create({
        data: {
          name: service.name,
          icon_url: service.iconUrl,
          api_base_url: service.apiBaseUrl,
          auth_type: service.authType,
          documentation_url: service.documentationUrl,
          is_active: service.isActive,
        },
      });
    }
  }
}
