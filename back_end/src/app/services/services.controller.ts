import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';

@Controller('services')
export class ServiceController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getAllServices() {
    return this.prisma.services.findMany();
  }

  @Get(':serviceId/triggers')
  async getTriggersByService(@Param('serviceId') serviceId: string) {
    return this.prisma.triggers.findMany({
      where: { service_id: Number(serviceId) },
    });
  }

  @Get(':serviceId/actions')
  async getActionsByService(@Param('serviceId') serviceId: string) {
    return this.prisma.actions.findMany({
      where: { service_id: Number(serviceId) },
    });
  }

  @Get(':serviceId/actions/:actionId')
  async getActionByService(
    @Param('serviceId') serviceId: string,
    @Param('actionId') actionId: string,
  ) {
    return this.prisma.actions.findFirst({
      where: { id: Number(actionId), service_id: Number(serviceId) },
    });
  }

  @Get(':serviceId/triggers/:triggerId')
  async getTriggerByService(
    @Param('serviceId') serviceId: string,
    @Param('triggerId') triggerId: string,
  ) {
    return this.prisma.triggers.findFirst({
      where: { id: Number(triggerId), service_id: Number(serviceId) },
    });
  }
}
