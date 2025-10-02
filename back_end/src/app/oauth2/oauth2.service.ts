import { Injectable, NotFoundException } from '@nestjs/common';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';
import { ServicesService } from '@app/services/services.service';
import { PrismaService } from '@root/prisma/prisma.service';

@Injectable()
export class Oauth2Service {
  constructor(
    private prisma: PrismaService,
    private servicesService: ServicesService,
  ) {}

  async createConnection(
    serviceName: string,
    userId: number,
    provider: OAuth2Provider,
  ): Promise<void> {
    const service = await this.servicesService.getServiceByName(serviceName);

    if (!service)
      throw new NotFoundException(`The service ${serviceName} do not exists.`);

    const data = {
      user_id: userId,
      service_id: service.id,
      access_token: provider.access_token,
      refresh_token: provider.refresh_token,
      expires_at: provider.expires_at,
      rate_limit_remaining: provider.rate_limit_remaining,
      rate_limit_reset: provider.rate_limit_reset,
      connection_name: provider.connection_name,
      account_identifier: provider.account_identifier,
      scopes: provider.scopes.join(','),
    };

    const connection = await this.prisma.connections.findUnique({
      where: {
        user_id_service_id: {
          user_id: userId,
          service_id: service.id,
        },
      },
    });

    if (connection) {
      await this.prisma.connections.update({
        where: {
          user_id_service_id: { user_id: userId, service_id: service.id },
        },
        data,
      });
    } else {
      await this.prisma.connections.create({ data });
    }
  }
}
