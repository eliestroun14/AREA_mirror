import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
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
  type GetTriggerByServiceParams,
  type GetActionByServiceParams,
  type GetActionsByServiceParams,
  type GetTriggersByServiceParams,
  type GetServiceParams,
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
    @Param() params: GetServiceParams,
  ): Promise<GetServiceResponse> {
    const serviceId = Number(params.serviceId);

    if (isNaN(serviceId))
      throw new NotFoundException(
        `Service with id ${serviceId} do not exists.`,
      );
    return this.servicesService.getServiceById(serviceId);
  }

  @Get(':serviceId/triggers')
  async getTriggersByService(
    @Param() params: GetTriggersByServiceParams,
  ): Promise<GetTriggersByServiceResponse> {
    const serviceId = Number(params.serviceId);

    if (isNaN(serviceId))
      throw new NotFoundException(
        `Service with id ${params.serviceId} do not exists.`,
      );
    return this.servicesService.getTriggersByService(Number(serviceId));
  }

  @Get(':serviceId/actions')
  async getActionsByService(
    @Param() params: GetActionsByServiceParams,
  ): Promise<GetActionsByServiceResponse> {
    const serviceId = Number(params.serviceId);

    if (isNaN(serviceId))
      throw new NotFoundException(
        `Service with id ${params.serviceId} do not exists.`,
      );
    return this.servicesService.getActionsByService(Number(serviceId));
  }

  @Get(':serviceId/actions/:actionId')
  async getActionByService(
    @Param() params: GetActionByServiceParams,
  ): Promise<GetActionByServiceResponse> {
    const serviceId = Number(params.serviceId);
    const actionId = Number(params.actionId);

    if (isNaN(serviceId) || isNaN(actionId)) {
      const name = isNaN(serviceId) ? 'Service' : 'Trigger';
      const id = isNaN(serviceId) ? params.serviceId : params.actionId;
      throw new NotFoundException(`${name} with id ${id} do not exists.`);
    }
    return this.servicesService.getActionByService(serviceId, actionId);
  }

  @Get(':serviceId/triggers/:triggerId')
  async getTriggerByService(
    @Param() params: GetTriggerByServiceParams,
  ): Promise<GetTriggerByServiceResponse> {
    const serviceId = Number(params.serviceId);
    const triggerId = Number(params.triggerId);

    if (isNaN(serviceId) || isNaN(triggerId)) {
      const name = isNaN(serviceId) ? 'Service' : 'Trigger';
      const id = isNaN(serviceId) ? params.serviceId : params.triggerId;
      throw new NotFoundException(`${name} with id ${id} do not exists.`);
    }
    return this.servicesService.getTriggerByService(serviceId, triggerId);
  }
}
