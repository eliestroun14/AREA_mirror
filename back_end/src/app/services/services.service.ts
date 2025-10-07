import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import {
  GetAllServicesResponse,
  GetServiceResponse,
  GetTriggersByServiceResponse,
  GetActionsByServiceResponse,
  GetActionByServiceResponse,
  GetTriggerByServiceResponse,
  SearchServicesResponse,
  SearchTriggersResponse,
  SearchActionsResponse,
  SearchAllResponse,
  ServiceDTO,
} from './services.dto';
import { formateDate } from '@config/utils';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllServices(): Promise<GetAllServicesResponse> {
    const services = await this.prisma.services.findMany();
    return services.map((service) => ({
      id: service.id,
      name: service.name,
      icon_url: service.icon_url ?? null,
      api_base_url: service.api_base_url ?? null,
      services_color: service.service_color,
      auth_type: service.auth_type,
      documentation_url: service.documentation_url ?? null,
      is_active: service.is_active,
      created_at: service.created_at ? formateDate(service.created_at) : '',
    }));
  }

  async getServiceByName(serviceName: string): Promise<GetServiceResponse> {
    const service = await this.prisma.services.findUnique({
      where: { name: serviceName },
    });

    if (!service)
      throw new NotFoundException(
        `Service with name ${serviceName} do not exists.`,
      );

    return {
      id: service.id,
      name: service.name,
      icon_url: service.icon_url ?? null,
      api_base_url: service.api_base_url ?? null,
      services_color: service.service_color,
      auth_type: service.auth_type,
      documentation_url: service.documentation_url ?? null,
      is_active: service.is_active,
      created_at: service.created_at ? formateDate(service.created_at) : '',
    };
  }

  async getServiceById(serviceId: number): Promise<GetServiceResponse> {
    const service = await this.prisma.services.findUnique({
      where: { id: serviceId },
    });

    if (!service)
      throw new NotFoundException(
        `Service with id ${serviceId} do not exists.`,
      );

    return {
      id: service.id,
      name: service.name,
      icon_url: service.icon_url ?? null,
      api_base_url: service.api_base_url ?? null,
      services_color: service.service_color,
      auth_type: service.auth_type,
      documentation_url: service.documentation_url ?? null,
      is_active: service.is_active,
      created_at: service.created_at ? formateDate(service.created_at) : '',
    };
  }

  async getTriggersByService(
    serviceId: number,
  ): Promise<GetTriggersByServiceResponse> {
    const triggers = await this.prisma.triggers.findMany({
      where: { service_id: serviceId },
    });
    return triggers.map((trigger) => ({
      id: trigger.id,
      service_id: trigger.service_id,
      http_request_id: trigger.http_request_id ?? null,
      webhook_id: trigger.webhook_id ?? null,
      trigger_type: trigger.trigger_type,
      name: trigger.name,
      description: trigger.description,
      polling_interval:
        trigger.polling_interval !== null &&
        trigger.polling_interval !== undefined
          ? trigger.polling_interval
          : null,
      fields: trigger.fields as Record<string, unknown>,
      variables: trigger.variables as Record<string, unknown>,
      is_active: trigger.is_active,
      created_at: trigger.created_at ? formateDate(trigger.created_at) : '',
      updated_at: trigger.updated_at ? formateDate(trigger.updated_at) : '',
    }));
  }

  async getActionsByService(
    serviceId: number,
  ): Promise<GetActionsByServiceResponse> {
    const actions = await this.prisma.actions.findMany({
      where: { service_id: serviceId },
    });
    return actions.map((action) => ({
      id: action.id,
      service_id: action.service_id,
      http_request_id: action.http_request_id,
      name: action.name,
      description: action.description,
      fields: action.fields as Record<string, unknown>,
      variables: action.variables as Record<string, unknown>,
      is_active: action.is_active,
      created_at: action.created_at ? formateDate(action.created_at) : '',
      updated_at: action.updated_at ? formateDate(action.updated_at) : '',
    }));
  }

  async getActionByService(
    serviceId: number,
    actionId: number,
  ): Promise<GetActionByServiceResponse> {
    const action = await this.prisma.actions.findFirst({
      where: { id: actionId, service_id: serviceId },
    });
    if (!action) return null;
    return {
      id: action.id,
      service_id: action.service_id,
      http_request_id: action.http_request_id,
      name: action.name,
      description: action.description,
      fields: action.fields as Record<string, unknown>,
      variables: action.variables as Record<string, unknown>,
      is_active: action.is_active,
      created_at: action.created_at ? formateDate(action.created_at) : '',
      updated_at: action.updated_at ? formateDate(action.updated_at) : '',
    };
  }

  async getTriggerByService(
    serviceId: number,
    triggerId: number,
  ): Promise<GetTriggerByServiceResponse> {
    const trigger = await this.prisma.triggers.findFirst({
      where: { id: triggerId, service_id: serviceId },
    });
    if (!trigger) return null;
    return {
      id: trigger.id,
      service_id: trigger.service_id,
      http_request_id: trigger.http_request_id ?? null,
      webhook_id: trigger.webhook_id ?? null,
      trigger_type: trigger.trigger_type,
      name: trigger.name,
      description: trigger.description,
      polling_interval:
        trigger.polling_interval !== null &&
        trigger.polling_interval !== undefined
          ? trigger.polling_interval
          : null,
      fields: trigger.fields as Record<string, unknown>,
      variables: trigger.variables as Record<string, unknown>,
      is_active: trigger.is_active,
      created_at: trigger.created_at ? formateDate(trigger.created_at) : '',
      updated_at: trigger.updated_at ? formateDate(trigger.updated_at) : '',
    };
  }

  // Search methods
  async searchServices(
    query: string,
    skip?: number,
    take?: number,
  ): Promise<SearchServicesResponse> {
    const whereClause = {
      name: {
        contains: query,
        mode: 'insensitive' as const,
      },
    };

    const services = await this.prisma.services.findMany({
      where: whereClause,
      skip: skip ?? undefined,
      take: take ?? undefined,
    });

    return services.map((service) => ({
      id: service.id,
      name: service.name,
      icon_url: service.icon_url ?? null,
      api_base_url: service.api_base_url ?? null,
      services_color: service.service_color,
      auth_type: service.auth_type,
      documentation_url: service.documentation_url ?? null,
      is_active: service.is_active,
      created_at: service.created_at ? formateDate(service.created_at) : '',
    }));
  }

  async searchTriggers(
    query: string,
    skip?: number,
    take?: number,
  ): Promise<SearchTriggersResponse> {
    const triggersWithService = await this.prisma.triggers.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive' as const,
        },
      },
      include: {
        service: true,
      },
    });

    // Get unique services
    const serviceMap = new Map<number, ServiceDTO>();

    for (const trigger of triggersWithService) {
      if (!serviceMap.has(trigger.service_id)) {
        serviceMap.set(trigger.service_id, {
          id: trigger.service.id,
          name: trigger.service.name,
          icon_url: trigger.service.icon_url ?? null,
          api_base_url: trigger.service.api_base_url ?? null,
          services_color: trigger.service.service_color,
          auth_type: trigger.service.auth_type,
          documentation_url: trigger.service.documentation_url ?? null,
          is_active: trigger.service.is_active,
          created_at: trigger.service.created_at
            ? formateDate(trigger.service.created_at)
            : '',
        });
      }
    }

    const services = Array.from(serviceMap.values());

    // Apply pagination
    if (skip !== undefined || take !== undefined) {
      const start = skip ?? 0;
      const end = take !== undefined ? start + take : undefined;
      return services.slice(start, end);
    }

    return services;
  }

  async searchActions(
    query: string,
    skip?: number,
    take?: number,
  ): Promise<SearchActionsResponse> {
    const actionsWithService = await this.prisma.actions.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive' as const,
        },
      },
      include: {
        service: true,
      },
    });

    // Get unique services
    const serviceMap = new Map<number, ServiceDTO>();

    for (const action of actionsWithService) {
      if (!serviceMap.has(action.service_id)) {
        serviceMap.set(action.service_id, {
          id: action.service.id,
          name: action.service.name,
          icon_url: action.service.icon_url ?? null,
          api_base_url: action.service.api_base_url ?? null,
          services_color: action.service.service_color,
          auth_type: action.service.auth_type,
          documentation_url: action.service.documentation_url ?? null,
          is_active: action.service.is_active,
          created_at: action.service.created_at
            ? formateDate(action.service.created_at)
            : '',
        });
      }
    }

    const services = Array.from(serviceMap.values());

    // Apply pagination
    if (skip !== undefined || take !== undefined) {
      const start = skip ?? 0;
      const end = take !== undefined ? start + take : undefined;
      return services.slice(start, end);
    }

    return services;
  }

  async searchAll(
    query: string,
    skip?: number,
    take?: number,
  ): Promise<SearchAllResponse> {
    const [servicesByName, servicesByTrigger, servicesByAction] =
      await Promise.all([
        this.searchServices(query, undefined, undefined),
        this.searchTriggers(query, undefined, undefined),
        this.searchActions(query, undefined, undefined),
      ]);

    // Merge all services and remove duplicates
    const serviceMap = new Map<number, ServiceDTO>();

    [...servicesByName, ...servicesByTrigger, ...servicesByAction].forEach(
      (service) => {
        if (!serviceMap.has(service.id)) {
          serviceMap.set(service.id, service);
        }
      },
    );

    const allServices = Array.from(serviceMap.values());

    // Apply pagination
    if (skip !== undefined || take !== undefined) {
      const start = skip ?? 0;
      const end = take !== undefined ? start + take : undefined;
      return allServices.slice(start, end);
    }

    return allServices;
  }
}
