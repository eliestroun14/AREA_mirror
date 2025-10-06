import { ApiProperty } from '@nestjs/swagger';

// Service DTO
export class ServiceDTO {
  @ApiProperty({
    description: 'Identifiant unique du service',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nom du service',
    example: 'github',
  })
  name: string;

  @ApiProperty({
    description: "URL de l'icône du service",
    example: '/assets/github.png',
    nullable: true,
  })
  icon_url: string | null;

  @ApiProperty({
    description: "URL de base de l'API du service",
    example: 'https://api.github.com',
    nullable: true,
  })
  api_base_url: string | null;

  @ApiProperty({
    description: 'Couleur du service (hex)',
    example: '#181717',
  })
  services_color: string;

  @ApiProperty({
    description: "Type d'authentification (oauth2, api_key, none)",
    example: 'oauth2',
  })
  auth_type: string;

  @ApiProperty({
    description: 'URL de la documentation du service',
    example: 'https://docs.github.com',
    nullable: true,
  })
  documentation_url: string | null;

  @ApiProperty({
    description: 'Indique si le service est actif',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Date de création du service (format UTC)',
    example: 'Mon, 04 Oct 2021 12:00:00 GMT',
  })
  created_at: string;
}

// Action DTO
export class ActionDTO {
  @ApiProperty({
    description: "Identifiant unique de l'action",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Identifiant du service associé',
    example: 1,
  })
  service_id: number;

  @ApiProperty({
    description: 'Identifiant de la requête HTTP associée',
    example: 1,
  })
  http_request_id: number;

  @ApiProperty({
    description: "Nom de l'action",
    example: 'create_issue',
  })
  name: string;

  @ApiProperty({
    description: "Description de l'action",
    example: 'Crée une nouvelle issue sur le repository',
  })
  description: string;

  @ApiProperty({
    description: "Champs requis pour exécuter l'action (JSON)",
    example: {
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
  })
  fields: any;

  @ApiProperty({
    description: 'Variables disponibles après exécution (JSON)',
    example: {
      issue_id: "ID de l'issue créée",
      issue_url: "URL de l'issue",
    },
  })
  variables: any;

  @ApiProperty({
    description: "Indique si l'action est active",
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: "Date de création de l'action (format UTC)",
    example: 'Mon, 04 Oct 2021 12:00:00 GMT',
  })
  created_at: string;

  @ApiProperty({
    description: "Date de dernière modification de l'action (format UTC)",
    example: 'Mon, 04 Oct 2021 12:00:00 GMT',
  })
  updated_at: string;
}

// Trigger DTO
export class TriggerDTO {
  @ApiProperty({
    description: 'Identifiant unique du trigger',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Identifiant du service associé',
    example: 1,
  })
  service_id: number;

  @ApiProperty({
    description: 'Identifiant de la requête HTTP associée',
    example: 1,
    nullable: true,
  })
  http_request_id: number | null;

  @ApiProperty({
    description: 'Identifiant du webhook associé',
    example: null,
    nullable: true,
  })
  webhook_id: number | null;

  @ApiProperty({
    description: 'Type de trigger (webhook, polling, schedule)',
    example: 'polling',
  })
  trigger_type: string;

  @ApiProperty({
    description: 'Nom du trigger',
    example: 'on_push',
  })
  name: string;

  @ApiProperty({
    description: 'Description du trigger',
    example: "Déclenché lorsqu'un push est effectué sur le repository",
  })
  description: string;

  @ApiProperty({
    description: 'Intervalle de polling en secondes (pour type polling)',
    example: 300,
    nullable: true,
  })
  polling_interval: number | null;

  @ApiProperty({
    description: 'Champs requis pour configurer le trigger (JSON)',
    example: {
      repository: {
        type: 'string',
        required: true,
        description: 'Nom du repository (owner/repo)',
      },
    },
  })
  fields: any;

  @ApiProperty({
    description: 'Variables fournies par le trigger (JSON)',
    example: {
      commit_sha: 'SHA du commit',
      commit_message: 'Message du commit',
      author: 'Auteur du commit',
    },
  })
  variables: any;

  @ApiProperty({
    description: 'Indique si le trigger est actif',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Date de création du trigger (format UTC)',
    example: 'Mon, 04 Oct 2021 12:00:00 GMT',
  })
  created_at: string;

  @ApiProperty({
    description: 'Date de dernière modification du trigger (format UTC)',
    example: 'Mon, 04 Oct 2021 12:00:00 GMT',
  })
  updated_at: string;
}

interface GetByServiceId {
  serviceId: string;
}

// GET /services
export type GetAllServicesResponse = ServiceDTO[];

// GET /services/:serviceId
export type GetServiceParams = GetByServiceId;
export type GetServiceResponse = ServiceDTO;

// GET /services/:serviceId/triggers
export type GetTriggersByServiceParams = GetByServiceId;
export type GetTriggersByServiceResponse = TriggerDTO[];

// GET /services/:serviceId/actions
export type GetActionsByServiceParams = GetByServiceId;
export type GetActionsByServiceResponse = ActionDTO[];

// GET /services/:serviceId/actions/:actionId
export interface GetActionByServiceParams {
  serviceId: string;
  actionId: string;
}
export type GetActionByServiceResponse = ActionDTO | null;

// GET /services/:serviceId/triggers/:triggerId
export interface GetTriggerByServiceParams {
  serviceId: string;
  triggerId: string;
}
export type GetTriggerByServiceResponse = TriggerDTO | null;
