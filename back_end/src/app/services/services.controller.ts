import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
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
  SearchServicesResponse,
  SearchTriggersResponse,
  SearchActionsResponse,
  SearchAllResponse,
  type GetTriggerByServiceParams,
  type GetActionByServiceParams,
  type GetActionsByServiceParams,
  type GetTriggersByServiceParams,
  type GetServiceParams,
} from './services.dto';
import { ServicesService } from './services.service';

@ApiTags('services')
@Controller('services')
export class ServiceController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtenir tous les services disponibles',
    description:
      'Retourne la liste de tous les services disponibles (GitHub, Discord, Gmail, etc.) avec leurs informations.',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des services récupérée avec succès',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'github' },
          icon_url: { type: 'string', example: '/assets/github.png' },
          api_base_url: { type: 'string', example: 'https://api.github.com' },
          services_color: { type: 'string', example: '#181717' },
          auth_type: { type: 'string', example: 'oauth2' },
          documentation_url: {
            type: 'string',
            example: 'https://docs.github.com',
          },
          is_active: { type: 'boolean', example: true },
          created_at: {
            type: 'string',
            example: 'Mon, 04 Oct 2021 12:00:00 GMT',
          },
        },
      },
      example: [
        {
          id: 1,
          name: 'github',
          icon_url: '/assets/github.png',
          api_base_url: 'https://api.github.com',
          services_color: '#181717',
          auth_type: 'oauth2',
          documentation_url: 'https://docs.github.com',
          is_active: true,
          created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        },
        {
          id: 2,
          name: 'discord',
          icon_url: '/assets/discord.png',
          api_base_url: 'https://discord.com/api',
          services_color: '#5865F2',
          auth_type: 'oauth2',
          documentation_url: 'https://discord.com/developers/docs',
          is_active: true,
          created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        },
        {
          id: 3,
          name: 'gmail',
          icon_url: '/assets/gmail.png',
          api_base_url: 'https://gmail.googleapis.com',
          services_color: '#EA4335',
          auth_type: 'oauth2',
          documentation_url: 'https://developers.google.com/gmail',
          is_active: true,
          created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        },
      ],
    },
  })
  async getAllServices(): Promise<GetAllServicesResponse> {
    return this.servicesService.getAllServices();
  }

  // Search routes - must be before :serviceId route
  @Get('search')
  @ApiOperation({
    summary: 'Rechercher des services par nom',
    description:
      'Recherche des services dont le nom contient la chaîne de recherche. Supporte la pagination avec skip et take.',
  })
  @ApiQuery({
    name: 'query',
    description: 'Terme de recherche pour le nom du service',
    example: 'git',
    required: true,
  })
  @ApiQuery({
    name: 'skip',
    description: "Nombre d'éléments à ignorer (pagination)",
    example: 0,
    required: false,
  })
  @ApiQuery({
    name: 'take',
    description: "Nombre maximum d'éléments à retourner",
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des services correspondant à la recherche',
    type: [ServiceDTO],
  })
  async searchServices(
    @Query('query') query: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ): Promise<SearchServicesResponse> {
    const skipNum = skip ? parseInt(skip, 10) : undefined;
    const takeNum = take ? parseInt(take, 10) : undefined;

    return this.servicesService.searchServices(query, skipNum, takeNum);
  }

  @Get('search/triggers')
  @ApiOperation({
    summary: 'Rechercher des services par nom de trigger',
    description:
      'Recherche des services qui contiennent des triggers dont le nom correspond à la recherche. Retourne uniquement la liste des services (sans les détails des triggers).',
  })
  @ApiQuery({
    name: 'query',
    description: 'Terme de recherche pour le nom du trigger',
    example: 'push',
    required: true,
  })
  @ApiQuery({
    name: 'skip',
    description: "Nombre d'éléments à ignorer (pagination)",
    example: 0,
    required: false,
  })
  @ApiQuery({
    name: 'take',
    description: "Nombre maximum d'éléments à retourner",
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des services contenant des triggers correspondants',
    type: [ServiceDTO],
  })
  async searchTriggers(
    @Query('query') query: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ): Promise<SearchTriggersResponse> {
    const skipNum = skip ? parseInt(skip, 10) : undefined;
    const takeNum = take ? parseInt(take, 10) : undefined;

    return this.servicesService.searchTriggers(query, skipNum, takeNum);
  }

  @Get('search/actions')
  @ApiOperation({
    summary: "Rechercher des services par nom d'action",
    description:
      'Recherche des services qui contiennent des actions dont le nom correspond à la recherche. Retourne uniquement la liste des services (sans les détails des actions).',
  })
  @ApiQuery({
    name: 'query',
    description: "Terme de recherche pour le nom de l'action",
    example: 'create',
    required: true,
  })
  @ApiQuery({
    name: 'skip',
    description: "Nombre d'éléments à ignorer (pagination)",
    example: 0,
    required: false,
  })
  @ApiQuery({
    name: 'take',
    description: "Nombre maximum d'éléments à retourner",
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des services contenant des actions correspondantes',
    type: [ServiceDTO],
  })
  async searchActions(
    @Query('query') query: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ): Promise<SearchActionsResponse> {
    const skipNum = skip ? parseInt(skip, 10) : undefined;
    const takeNum = take ? parseInt(take, 10) : undefined;

    return this.servicesService.searchActions(query, skipNum, takeNum);
  }

  @Get('search/all')
  @ApiOperation({
    summary: 'Recherche globale (services, triggers, actions)',
    description:
      'Recherche simultanément dans les noms de services, triggers et actions. Retourne une liste unique de services qui correspondent (par nom, trigger ou action).',
  })
  @ApiQuery({
    name: 'query',
    description:
      'Terme de recherche à appliquer sur les services, triggers et actions',
    example: 'github',
    required: true,
  })
  @ApiQuery({
    name: 'skip',
    description: "Nombre d'éléments à ignorer (pagination)",
    example: 0,
    required: false,
  })
  @ApiQuery({
    name: 'take',
    description: "Nombre maximum d'éléments à retourner",
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description:
      'Liste unique des services correspondants (dédupliqués si trouvés dans plusieurs catégories)',
    type: [ServiceDTO],
  })
  async searchAll(
    @Query('query') query: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ): Promise<SearchAllResponse> {
    const skipNum = skip ? parseInt(skip, 10) : undefined;
    const takeNum = take ? parseInt(take, 10) : undefined;

    return this.servicesService.searchAll(query, skipNum, takeNum);
  }

  @Get(':serviceId')
  @ApiOperation({
    summary: 'Obtenir un service par son ID',
    description: "Retourne les détails d'un service spécifique.",
  })
  @ApiParam({
    name: 'serviceId',
    description: 'Identifiant du service',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Service trouvé',
    type: ServiceDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Service non trouvé',
  })
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
  @ApiOperation({
    summary: "Obtenir les triggers d'un service",
    description:
      'Retourne la liste de tous les triggers disponibles pour un service donné.',
  })
  @ApiParam({
    name: 'serviceId',
    description: 'Identifiant du service',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des triggers récupérée avec succès',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          service_id: { type: 'number' },
          http_request_id: { type: 'number', nullable: true },
          webhook_id: { type: 'number', nullable: true },
          trigger_type: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          polling_interval: { type: 'number', nullable: true },
          fields: { type: 'object' },
          variables: { type: 'object' },
          is_active: { type: 'boolean' },
          created_at: { type: 'string' },
          updated_at: { type: 'string' },
        },
      },
      example: [
        {
          id: 1,
          service_id: 1,
          http_request_id: 1,
          webhook_id: null,
          trigger_type: 'polling',
          name: 'on_push',
          description:
            "Déclenché lorsqu'un push est effectué sur le repository",
          polling_interval: 300,
          fields: {
            repository: {
              type: 'string',
              required: true,
              description: 'Nom du repository (owner/repo)',
            },
          },
          variables: {
            commit_sha: 'SHA du commit',
            commit_message: 'Message du commit',
            author: 'Auteur du commit',
          },
          is_active: true,
          created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
          updated_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        },
        {
          id: 2,
          service_id: 1,
          http_request_id: 2,
          webhook_id: null,
          trigger_type: 'webhook',
          name: 'on_issue_opened',
          description: "Déclenché lorsqu'une issue est créée",
          polling_interval: null,
          fields: {
            repository: {
              type: 'string',
              required: true,
              description: 'Nom du repository (owner/repo)',
            },
          },
          variables: {
            issue_id: "ID de l'issue",
            issue_title: "Titre de l'issue",
            issue_author: "Auteur de l'issue",
          },
          is_active: true,
          created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
          updated_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Service non trouvé',
  })
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
  @ApiOperation({
    summary: "Obtenir les actions d'un service",
    description:
      'Retourne la liste de toutes les actions disponibles pour un service donné.',
  })
  @ApiParam({
    name: 'serviceId',
    description: 'Identifiant du service',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des actions récupérée avec succès',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          service_id: { type: 'number' },
          http_request_id: { type: 'number' },
          name: { type: 'string' },
          description: { type: 'string' },
          fields: { type: 'object' },
          variables: { type: 'object' },
          is_active: { type: 'boolean' },
          created_at: { type: 'string' },
          updated_at: { type: 'string' },
        },
      },
      example: [
        {
          id: 1,
          service_id: 1,
          http_request_id: 1,
          name: 'create_issue',
          description: 'Crée une nouvelle issue sur le repository',
          fields: {
            repository: {
              type: 'string',
              required: true,
              description: 'Nom du repository (owner/repo)',
            },
            title: {
              type: 'string',
              required: true,
              description: "Titre de l'issue",
            },
            body: {
              type: 'string',
              required: false,
              description: "Corps de l'issue",
            },
          },
          variables: {
            issue_id: "ID de l'issue créée",
            issue_url: "URL de l'issue",
          },
          is_active: true,
          created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
          updated_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        },
        {
          id: 2,
          service_id: 1,
          http_request_id: 2,
          name: 'add_comment',
          description: 'Ajoute un commentaire sur une issue ou PR',
          fields: {
            repository: {
              type: 'string',
              required: true,
              description: 'Nom du repository (owner/repo)',
            },
            issue_number: {
              type: 'number',
              required: true,
              description: "Numéro de l'issue ou de la PR",
            },
            comment: {
              type: 'string',
              required: true,
              description: 'Contenu du commentaire',
            },
          },
          variables: {
            comment_id: 'ID du commentaire créé',
            comment_url: 'URL du commentaire',
          },
          is_active: true,
          created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
          updated_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Service non trouvé',
  })
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
  @ApiOperation({
    summary: 'Obtenir une action spécifique',
    description: "Retourne les détails d'une action spécifique d'un service.",
  })
  @ApiParam({
    name: 'serviceId',
    description: 'Identifiant du service',
    example: 1,
    type: Number,
  })
  @ApiParam({
    name: 'actionId',
    description: "Identifiant de l'action",
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Action trouvée',
    type: ActionDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Service ou action non trouvé',
  })
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
  @ApiOperation({
    summary: 'Obtenir un trigger spécifique',
    description: "Retourne les détails d'un trigger spécifique d'un service.",
  })
  @ApiParam({
    name: 'serviceId',
    description: 'Identifiant du service',
    example: 1,
    type: Number,
  })
  @ApiParam({
    name: 'triggerId',
    description: 'Identifiant du trigger',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Trigger trouvé',
    type: TriggerDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Service ou trigger non trouvé',
  })
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
