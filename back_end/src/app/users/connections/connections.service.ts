import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';
import { ServicesService } from '@app/services/services.service';
import { connections, Prisma } from '@prisma/client';

type ConnectionWithService = Prisma.connectionsGetPayload<{
  include: { service: true };
}>;

@Injectable()
export class ConnectionsService {
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

    const connection = await this.prisma.connections.findFirst({
      where: {
        user_id: userId,
        service_id: service.id,
        account_identifier: provider.account_identifier,
      },
    });

    if (connection) {
      await this.prisma.connections.update({
        where: {
          user_id_service_id_account_identifier: {
            user_id: connection.user_id,
            service_id: connection.service_id,
            account_identifier: connection.account_identifier,
          },
        },
        data,
      });
    } else {
      await this.prisma.connections.create({ data });
    }
  }

  async getUserConnection(
    userId: number,
    serviceId: number,
    account_identifier: string,
  ): Promise<connections> {
    const connection = await this.prisma.connections.findFirst({
      where: {
        user_id: userId,
        service_id: serviceId,
        account_identifier: account_identifier,
      },
    });

    if (!connection)
      throw new NotFoundException(
        `Connection with account's id ${account_identifier} do not exists.`,
      );
    return connection;
  }

  async getAllUserConnections(
    userId: number,
  ): Promise<ConnectionWithService[]> {
    return this.prisma.connections.findMany({
      where: {
        user_id: userId,
        is_active: true,
      },
      include: {
        service: true,
      },
    });
  }

  async getUserConnectionsByService(
    userId: number,
    serviceId: number,
  ): Promise<ConnectionWithService[]> {
    return this.prisma.connections.findMany({
      where: {
        user_id: userId,
        service_id: serviceId,
        is_active: true,
      },
      include: {
        service: true,
      },
    });
  }
}
