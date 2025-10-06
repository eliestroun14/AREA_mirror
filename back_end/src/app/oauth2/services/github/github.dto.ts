import { ApiProperty } from '@nestjs/swagger';
import { JwtRequest } from '@app/auth/jwt/jwt.dto';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

/**
 * Informations du provider GitHub après authentification OAuth2
 */
export class GithubProvider extends OAuth2Provider {
  @ApiProperty({
    description: 'Email du compte GitHub',
    example: 'user@github.com',
  })
  email: string;

  @ApiProperty({
    description: 'Username GitHub',
    example: 'octocat',
  })
  username: string;

  @ApiProperty({
    description: "URL de l'avatar GitHub",
    example: 'https://avatars.githubusercontent.com/u/123456',
  })
  picture: string;
}

/**
 * Requête contenant les informations GitHub après OAuth2
 * (Utilisé en interne)
 */
export interface GithubProviderRequest extends JwtRequest {
  provider: GithubProvider;
}
