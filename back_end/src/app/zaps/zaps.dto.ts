import { IsInt, IsString, IsOptional } from 'class-validator';

// ZAP DTO
export interface ZapDTO {
  id: number;
  user_id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// GET /zaps
export type GetAllZapsResponse = ZapDTO[];

// GET /zaps/:zapId
export type GetZapResponse = ZapDTO | null;

// POST /zaps/create
export class CreateZapBody {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
export type CreateZapResponse = ZapDTO;

// DELETE /zaps/:zapId
export interface DeleteZapResponse {
  message: string;
}

// PUT /zaps/:zapId
export class UpdateZapBody {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
export type UpdateZapResponse = ZapDTO;

// PATCH /zaps/:zapId
export type ActivateZapResponse = ZapDTO;
