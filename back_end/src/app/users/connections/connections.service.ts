import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';

@Injectable()
export class ConnectionsService {
  constructor(private prisma: PrismaService) {}

  async getUserConnection(userId: number, serviceId: number) {
    return this.prisma.connections.findUnique({
      where: {
        user_id_service_id: {
          user_id: userId,
          service_id: serviceId,
        },
      },
    });
  }
}
