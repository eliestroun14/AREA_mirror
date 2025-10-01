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
import { PrismaService } from '@root/prisma/prisma.service';

@Controller('services')
export class ServiceController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getAllServices(): Promise<GetAllServicesResponse> {
    const services = await this.prisma.services.findMany();
    return services.map((service) => ({
      id: Number(service.id),
      name: String(service.name),
      icon_url: service.icon_url ?? null,
      api_base_url: service.api_base_url ?? null,
      services_color: String(service.services_color),
      auth_type: String(service.auth_type),
      documentation_url: service.documentation_url ?? null,
      is_active: Boolean(service.is_active),
      created_at: service.created_at?.toISOString() ?? '',
    }));
  }

  @Get(':serviceId')
  async getService(
    @Param('serviceId') serviceId: string,
  ): Promise<GetServiceResponse> {
    const service = await this.prisma.services.findUnique({
      where: { id: Number(serviceId) },
    });
    if (!service) return null;
    return {
      id: Number(service.id),
      name: String(service.name),
      icon_url: service.icon_url ?? null,
      api_base_url: service.api_base_url ?? null,
      services_color: String(service.services_color),
      auth_type: String(service.auth_type),
      documentation_url: service.documentation_url ?? null,
      is_active: Boolean(service.is_active),
      created_at: service.created_at?.toISOString() ?? '',
    };
  }

  @Get(':serviceId/triggers')
  async getTriggersByService(
    @Param('serviceId') serviceId: string,
  ): Promise<GetTriggersByServiceResponse> {
    const triggers = await this.prisma.triggers.findMany({
      where: { service_id: Number(serviceId) },
    });
    return triggers.map((trigger) => ({
      id: Number(trigger.id),
      service_id: Number(trigger.service_id),
      http_request_id: trigger.http_request_id ?? null,
      webhook_id: trigger.webhook_id ?? null,
      trigger_type: String(trigger.trigger_type),
      name: String(trigger.name),
      description: String(trigger.description),
      polling_interval:
        trigger.polling_interval !== null &&
        trigger.polling_interval !== undefined
          ? Number(trigger.polling_interval)
          : null,
      fields: trigger.fields,
      variables: trigger.variables,
      is_active: Boolean(trigger.is_active),
      created_at: trigger.created_at?.toISOString() ?? '',
      updated_at: trigger.updated_at?.toISOString() ?? '',
    }));
  }

  @Get(':serviceId/actions')
  async getActionsByService(
    @Param('serviceId') serviceId: string,
  ): Promise<GetActionsByServiceResponse> {
    const actions = await this.prisma.actions.findMany({
      where: { service_id: Number(serviceId) },
    });
    return actions.map((action) => ({
      id: Number(action.id),
      service_id: Number(action.service_id),
      http_request_id: Number(action.http_request_id),
      name: String(action.name),
      description: String(action.description),
      fields: action.fields,
      variables: action.variables,
      is_active: Boolean(action.is_active),
      created_at: action.created_at?.toISOString() ?? '',
      updated_at: action.updated_at?.toISOString() ?? '',
    }));
  }

  @Get(':serviceId/actions/:actionId')
  async getActionByService(
    @Param('serviceId') serviceId: string,
    @Param('actionId') actionId: string,
  ): Promise<GetActionByServiceResponse> {
    const action = await this.prisma.actions.findFirst({
      where: { id: Number(actionId), service_id: Number(serviceId) },
    });
    if (!action) return null;
    return {
      id: Number(action.id),
      service_id: Number(action.service_id),
      http_request_id: Number(action.http_request_id),
      name: String(action.name),
      description: String(action.description),
      fields: action.fields,
      variables: action.variables,
      is_active: Boolean(action.is_active),
      created_at: action.created_at?.toISOString() ?? '',
      updated_at: action.updated_at?.toISOString() ?? '',
    };
  }

  @Get(':serviceId/triggers/:triggerId')
  async getTriggerByService(
    @Param('serviceId') serviceId: string,
    @Param('triggerId') triggerId: string,
  ): Promise<GetTriggerByServiceResponse> {
    const trigger = await this.prisma.triggers.findFirst({
      where: { id: Number(triggerId), service_id: Number(serviceId) },
    });
    if (!trigger) return null;
    return {
      id: Number(trigger.id),
      service_id: Number(trigger.service_id),
      http_request_id: trigger.http_request_id ?? null,
      webhook_id: trigger.webhook_id ?? null,
      trigger_type: String(trigger.trigger_type),
      name: String(trigger.name),
      description: String(trigger.description),
      polling_interval:
        trigger.polling_interval !== null &&
        trigger.polling_interval !== undefined
          ? Number(trigger.polling_interval)
          : null,
      fields: trigger.fields,
      variables: trigger.variables,
      is_active: Boolean(trigger.is_active),
      created_at: trigger.created_at?.toISOString() ?? '',
      updated_at: trigger.updated_at?.toISOString() ?? '',
    };
  }
}
