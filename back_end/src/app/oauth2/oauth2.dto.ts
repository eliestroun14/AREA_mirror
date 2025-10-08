import { ApiProperty } from '@nestjs/swagger';
import { JwtPayload } from '@app/auth/jwt/jwt.dto';

/**
 * Informations de connexion OAuth2 pour un service externe
 */
export class OAuth2Provider {
  @ApiProperty({
    description: 'Nom de la connexion',
    example: 'gmail',
  })
  connection_name: string;

  @ApiProperty({
    description: 'Identifiant du compte (email, username, etc.)',
    example: 'user@gmail.com',
  })
  account_identifier: string;

  @ApiProperty({
    description: 'Liste des scopes OAuth2 autorisés',
    example: ['https://www.googleapis.com/auth/gmail.send'],
    isArray: true,
  })
  scopes: string[];

  @ApiProperty({
    description: "Token d'accès OAuth2",
    example: 'ya29.a0AfH6SMBx...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Token de rafraîchissement OAuth2',
    example: '1//0gL3BqC4T...',
    nullable: true,
  })
  refresh_token: string | null;

  @ApiProperty({
    description: "Date d'expiration du token",
    example: '2025-10-06T12:00:00.000Z',
    nullable: true,
  })
  expires_at: Date | null;

  @ApiProperty({
    description: 'Nombre de requêtes restantes (rate limiting)',
    example: 5000,
    required: false,
  })
  rate_limit_remaining: number | undefined;

  @ApiProperty({
    description: 'Date de reset du rate limit',
    example: '2025-10-06T13:00:00.000Z',
    nullable: true,
  })
  rate_limit_reset: Date | null;
}

/**
 * Requête contenant les informations OAuth2 après authentification
 * (Utilisé en interne, pas exposé directement dans Swagger)
 */
export interface StrategyCallbackRequest extends Request {
  provider: OAuth2Provider;
  user: JwtPayload;
}
