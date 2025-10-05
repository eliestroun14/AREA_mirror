import { IsEmail, IsString } from 'class-validator';

// DTO
export interface UserDTO {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// GET
export type GetMeResponse = UserDTO;

// PUT
export class PutMeBody {
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
export type PutMeResponse = UserDTO;

// DELETE
export interface DeleteMeResponse {
  message: string;
  statusCode: number;
}

// LOGOUT
export interface LogoutMeResponse {
  message: string;
  statusCode: number;
}
