import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDefined,
  IsNumber,
  IsObject,
} from 'class-validator';
import { DeleteResponse } from '@config/dto';
import type { StepDTO } from '@app/zaps/steps/steps.dto';

// ===============
//      DTOs
// ===============
export interface ZapDTO {
  id: number;
  user_id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
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
  @IsOptional()
  @IsString()
  name?: string;

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
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
export type PutZapResponse = ZapDTO;

// PATCH /zaps/:zapId/toggle
export type PatchZapByIdParams = ZapByIdParams;
export class PatchZapToggleBody {
  @IsDefined()
  @IsBoolean()
  is_active: boolean;
}
export type PatchZapResponse = ZapDTO;

// POST /zaps/:zapId/trigger
export type PostZapTriggerParams = ZapByIdParams;
export class PostZapTriggerBody {
  @IsNumber()
  triggerId: number;

  @IsString()
  accountIdentifier: string;

  @IsObject()
  payload: object;
}

export interface PostZapTriggerResponse {
  zap_id: number;
}

// GET /zaps/:zapId/trigger
export type GetZapTriggerParams = ZapByIdParams;
export type GetZapTriggerResponse = StepDTO;

// PATCH /zaps/:zapId/trigger
export type PatchZapTriggerParams = ZapByIdParams;
export class PatchZapTriggerBody {
  @IsOptional()
  @IsNumber()
  triggerId?: number;

  @IsOptional()
  @IsString()
  accountIdentifier?: string;

  @IsOptional()
  @IsObject()
  payload?: object;
}

export interface PatchZapTriggerResponse {
  zap_id: number;
}

// DELETE /zaps/:zapId/trigger
export type DeleteZapTriggerParams = ZapByIdParams;
export type DeleteZapTriggerResponse = DeleteResponse;

// POST /zaps/:zapId/action
export type PostZapActionParams = ZapByIdParams;
export class PostZapActionBody {
  @IsNumber()
  actionId: number;

  @IsNumber()
  fromStepId: number;

  @IsNumber()
  stepOrder: number;

  @IsString()
  accountIdentifier: string;

  @IsObject()
  payload: object;
}

export interface PostZapActionResponse {
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
  @IsOptional()
  @IsNumber()
  actionId?: number;

  @IsOptional()
  @IsString()
  accountIdentifier?: string;

  @IsOptional()
  @IsObject()
  payload?: object;

  @IsOptional()
  @IsNumber()
  stepOrder?: number;
}
export interface PatchZapActionResponse {
  action_id: number;
}

// DELETE /zaps/:zapId/actions/:actionId
export interface DeleteZapActionByIdParams {
  zapId: string;
  actionId: string;
}
export type DeleteZapActionResponse = DeleteResponse;
