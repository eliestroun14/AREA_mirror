import { ApiProperty } from '@nestjs/swagger';
import { Request } from 'express';

/**
 * Payload contenu dans le JWT token
 */
export class JwtPayload {
  @ApiProperty({
    description: "Identifiant unique de l'utilisateur",
    example: 123,
    type: Number,
  })
  userId: number;
}

/**
 * Extension de Request avec les informations de l'utilisateur authentifié
 * (Utilisé en interne, pas exposé dans Swagger)
 */
export interface JwtRequest extends Request {
  user: JwtPayload;
}
