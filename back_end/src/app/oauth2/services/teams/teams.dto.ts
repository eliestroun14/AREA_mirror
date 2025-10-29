import { ApiProperty } from '@nestjs/swagger';
import { JwtRequest } from '@app/auth/jwt/jwt.dto';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

/**
 * Informations du provider Microsoft Teams après authentification OAuth2
 */
export class TeamsProvider extends OAuth2Provider {
  tenant_id: string;
  given_name: string;
  family_name: string;
  upn: string;
  email: string;
  username: string;
  picture: string;
}

/**
 * Requête contenant les informations Teams après OAuth2
 * (Utilisé en interne)
 */
export interface TeamsProviderRequest extends JwtRequest {
  provider: TeamsProvider;
}
