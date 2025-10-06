import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO représentant un utilisateur
 */
export class UserDTO {
  @ApiProperty({
    description: "Identifiant unique de l'utilisateur",
    example: 123,
  })
  id: number;

  @ApiProperty({
    description: "Email de l'utilisateur",
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: "Nom de l'utilisateur",
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Date de création du compte (format UTC)',
    example: 'Mon, 04 Oct 2021 12:00:00 GMT',
  })
  created_at: string;

  @ApiProperty({
    description: 'Date de dernière modification (format UTC)',
    example: 'Mon, 04 Oct 2021 12:00:00 GMT',
  })
  updated_at: string;
}

// GET
export type GetMeResponse = UserDTO;

// PUT
export class PutMeBody {
  @ApiProperty({
    description: "Nouvel email de l'utilisateur",
    example: 'newemail@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Nouveau nom de l'utilisateur",
    example: 'Jane Doe',
  })
  @IsString()
  name: string;
}
export type PutMeResponse = UserDTO;

// DELETE
export class DeleteMeResponse {
  @ApiProperty({
    description: 'Message de confirmation',
    example: 'Your account has been deleted.',
  })
  message: string;

  @ApiProperty({
    description: 'Code de statut HTTP',
    example: 204,
  })
  statusCode: number;
}

// LOGOUT
export class LogoutMeResponse {
  @ApiProperty({
    description: 'Message de confirmation',
    example: 'You have been successfully logged out.',
  })
  message: string;

  @ApiProperty({
    description: 'Code de statut HTTP',
    example: 200,
  })
  statusCode: number;
}
