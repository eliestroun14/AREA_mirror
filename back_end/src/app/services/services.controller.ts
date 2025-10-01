import { Controller, Get, Param } from '@nestjs/common';
import {
  ServiceDTO,
  ActionDTO,
  TriggerDTO,
  GetAllServicesResponse,
  GetServiceResponse,
  GetTriggersByServiceResponse,
  GetActionsByServiceResponse,
  GetActionByServiceResponse,
  GetTriggerByServiceResponse,
} from './services.dto';
import { ServicesService } from './services.service';

@Controller('services')
export class ServiceController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getAllServices(): Promise<GetAllServicesResponse> {
    return this.servicesService.getAllServices();
  }

  @Get(':serviceId')
  async getService(
    @Param('serviceId') serviceId: string,
  ): Promise<GetServiceResponse> {
    return this.servicesService.getService(serviceId);
  }

  @Get(':serviceId/triggers')
  async getTriggersByService(
    @Param('serviceId') serviceId: string,
  ): Promise<GetTriggersByServiceResponse> {
    return this.servicesService.getTriggersByService(serviceId);
  }

  @Get(':serviceId/actions')
  async getActionsByService(
    @Param('serviceId') serviceId: string,
  ): Promise<GetActionsByServiceResponse> {
    return this.servicesService.getActionsByService(serviceId);
  }

  @Get(':serviceId/actions/:actionId')
  async getActionByService(
    @Param('serviceId') serviceId: string,
    @Param('actionId') actionId: string,
  ): Promise<GetActionByServiceResponse> {
    return this.servicesService.getActionByService(serviceId, actionId);
  }

  @Get(':serviceId/triggers/:triggerId')
  async getTriggerByService(
    @Param('serviceId') serviceId: string,
    @Param('triggerId') triggerId: string,
  ): Promise<GetTriggerByServiceResponse> {
    return this.servicesService.getTriggerByService(serviceId, triggerId);
  }
}
