import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from '@app/users/users.dto';

/**
 * DTO pour la connexion utilisateur
 */
export class SignInBody {
  @ApiProperty({
    description: "Email de l'utilisateur",
    example: 'user@example.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: 'MySecurePassword123!',
    type: String,
    minLength: 8,
  })
  @IsString()
  password: string;
}

/**
 * Réponse de connexion avec le token JWT
 */
export class SignInResponse {
  @ApiProperty({
    description: 'Token JWT de session',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiaWF0IjoxNjMzMDI0ODAwfQ.abc123',
  })
  session_token: string;
}

/**
 * DTO pour l'inscription utilisateur
 */
export class SignUpBody {
  @ApiProperty({
    description: "Email de l'utilisateur",
    example: 'newuser@example.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Nom complet de l'utilisateur",
    example: 'John Doe',
    type: String,
    minLength: 2,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: 'MySecurePassword123!',
    type: String,
    minLength: 8,
  })
  @IsString()
  password: string;
}

export type SignUpResponse = UserDTO;
