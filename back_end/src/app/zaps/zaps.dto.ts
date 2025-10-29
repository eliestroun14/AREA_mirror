import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDefined,
  IsNumber,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeleteResponse } from '@config/dto';
import type { StepDTO } from '@app/zaps/steps/steps.dto';

// ===============
//      DTOs
// ===============
export class ZapDTO {
  @ApiProperty({
    description: 'Identifiant unique du zap',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "Identifiant de l'utilisateur propriétaire du zap",
    example: 42,
  })
  user_id: number;

  @ApiProperty({
    description: 'Nom du zap',
    example: 'Mon automatisation GitHub',
  })
  name: string;

  @ApiProperty({
    description: 'Description du zap',
    example: 'Crée une issue Discord quand un push est effectué',
  })
  description: string;

  @ApiProperty({
    description:
      'Indique si le zap est actif ou non (false par défaut à la création)',
    example: false,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Date de création du zap',
    example: 'Mon, 04 Oct 2021 12:00:00 GMT',
  })
  created_at: string;

  @ApiProperty({
    description: 'Date de dernière mise à jour du zap',
    example: 'Mon, 04 Oct 2021 12:30:00 GMT',
  })
  updated_at: string;
}

// ==================
//      REQUESTS
// ==================
interface ZapByIdParams {
  zapId: string;
}

// GET /zaps
export type GetAllZapsResponse = ZapDTO[];

// GET /zaps/:zapId
export type GetZapByIdParams = ZapByIdParams;
export type GetZapResponse = ZapDTO | null;

// POST /zaps
export class PostZapBody {
  @ApiPropertyOptional({
    description: 'Nom du zap',
    example: 'Mon automatisation GitHub',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Description du zap',
    example: 'Crée une issue Discord quand un push est effectué',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
export type PostZapResponse = ZapDTO;

// DELETE /zaps/:zapId
export type DeleteZapByIdParams = ZapByIdParams;
export type DeleteZapResponse = DeleteResponse;

// PUT /zaps/:zapId
export type PutZapByIdParams = ZapByIdParams;
export class PutZapBody {
  @ApiPropertyOptional({
    description: 'Nouveau nom du zap',
    example: 'Mon automatisation GitHub (modifiée)',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Nouvelle description du zap',
    example: 'Envoie un message Discord quand un push est effectué',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
export type PutZapResponse = ZapDTO;

// PATCH /zaps/:zapId/toggle
export type PatchZapByIdParams = ZapByIdParams;
export class PatchZapToggleBody {
  @ApiProperty({
    description: 'Active ou désactive le zap',
    example: true,
  })
  @IsDefined()
  @IsBoolean()
  is_active: boolean;
}
export type PatchZapResponse = ZapDTO;

// POST /zaps/:zapId/trigger
export type PostZapTriggerParams = ZapByIdParams;
export class PostZapTriggerBody {
  @ApiProperty({
    description: 'Identifiant du trigger à utiliser',
    example: 1,
  })
  @IsNumber()
  triggerId: number;

  @ApiProperty({
    description: 'Identifiant du compte de service à utiliser',
    example: 'github_123456',
  })
  @IsString()
  accountIdentifier: string;

  @ApiProperty({
    description: 'Configuration du trigger (fields)',
    example: {
      repository: 'owner/repo',
    },
  })
  @IsObject()
  payload: object;
}

export class PostZapTriggerResponse {
  @ApiProperty({
    description: 'Identifiant du zap',
    example: 1,
  })
  zap_id: number;
}

// GET /zaps/:zapId/trigger
export type GetZapTriggerParams = ZapByIdParams;
export type GetZapTriggerResponse = StepDTO;

// PATCH /zaps/:zapId/trigger
export type PatchZapTriggerParams = ZapByIdParams;
export class PatchZapTriggerBody {
  @ApiPropertyOptional({
    description: 'Nouvel identifiant du trigger',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  triggerId?: number;

  @ApiPropertyOptional({
    description: 'Nouvel identifiant du compte de service',
    example: 'github_654321',
  })
  @IsOptional()
  @IsString()
  accountIdentifier?: string;

  @ApiPropertyOptional({
    description: 'Nouvelle configuration du trigger',
    example: {
      repository: 'owner/new-repo',
    },
  })
  @IsOptional()
  @IsObject()
  payload?: object;
}

export class PatchZapTriggerResponse {
  @ApiProperty({
    description: 'Identifiant du zap',
    example: 1,
  })
  zap_id: number;
}

// DELETE /zaps/:zapId/trigger
export type DeleteZapTriggerParams = ZapByIdParams;
export type DeleteZapTriggerResponse = DeleteResponse;

// POST /zaps/:zapId/action
export type PostZapActionParams = ZapByIdParams;
export class PostZapActionBody {
  @ApiProperty({
    description: "Identifiant de l'action à exécuter",
    example: 1,
  })
  @IsNumber()
  actionId: number;

  @ApiProperty({
    description: "Identifiant de l'étape source",
    example: 1,
  })
  @IsNumber()
  fromStepId: number;

  @ApiProperty({
    description: "Ordre d'exécution de l'action",
    example: 1,
  })
  @IsNumber()
  stepOrder: number;

  @ApiProperty({
    description: "Identifiant du compte de service à utiliser pour l'action",
    example: 'discord_789',
  })
  @IsString()
  accountIdentifier: string;

  @ApiProperty({
    description: "Configuration de l'action (fields)",
    example: {
      channel_id: '123456789',
      message: 'Nouveau push sur {{repository}}',
    },
  })
  @IsObject()
  payload: object;
}

export class PostZapActionResponse {
  @ApiProperty({
    description: 'Identifiant du zap',
    example: 1,
  })
  zap_id: number;
}

// GET /zaps/:zapId/actions
export type GetZapActionsParams = ZapByIdParams;
export type GetZapActionsResponse = StepDTO[];

// GET /zaps/:zapId/actions/:actionId
export interface GetZapActionByIdParams {
  zapId: string;
  actionId: string;
}
export type GetZapActionByIdResponse = StepDTO;

// PATCH /zaps/:zapId/actions/:actionId
export interface PatchZapActionByIdParams {
  zapId: string;
  actionId: string;
}
export class PatchZapActionBody {
  @ApiPropertyOptional({
    description: "Nouvel identifiant de l'action",
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  actionId?: number;

  @ApiPropertyOptional({
    description: 'Nouvel identifiant du compte de service',
    example: 'discord_999',
  })
  @IsOptional()
  @IsString()
  accountIdentifier?: string;

  @ApiPropertyOptional({
    description: "Nouvelle configuration de l'action",
    example: {
      channel_id: '987654321',
      message: 'Nouveau commit sur {{repository}} par {{author}}',
    },
  })
  @IsOptional()
  @IsObject()
  payload?: object;

  @ApiPropertyOptional({
    description: "Nouvel ordre d'exécution",
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  stepOrder?: number;

  @ApiPropertyOptional({
    description: "Nouvel identifiant de l'étape source (source_step_id)",
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  fromStepId?: number;
}
export class PatchZapActionResponse {
  @ApiProperty({
    description: "Identifiant de l'action",
    example: 1,
  })
  action_id: number;
}

// DELETE /zaps/:zapId/actions/:actionId
export interface DeleteZapActionByIdParams {
  zapId: string;
  actionId: string;
}
export type DeleteZapActionResponse = DeleteResponse;
