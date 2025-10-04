import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDefined,
  IsNumber,
  IsObject,
} from 'class-validator';
import { DeleteResponse } from '@config/dto';
import { users } from '@prisma/client';

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
  @IsString()
  name: string;

  @IsString()
  description: string;
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
