import { ApiProperty } from '@nestjs/swagger';
import { JwtRequest } from '@app/auth/jwt/jwt.dto';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

/**
 * Informations du provider Gmail après authentification OAuth2
 */
export class GmailProvider extends OAuth2Provider {
  @ApiProperty({
    description: 'Email du compte Gmail',
    example: 'user@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: "Nom d'utilisateur Gmail",
    example: 'John Doe',
  })
  username: string;

  @ApiProperty({
    description: 'URL de la photo de profil Gmail',
    example: 'https://lh3.googleusercontent.com/a/default-user',
  })
  picture: string;
}

/**
 * Requête contenant les informations Gmail après OAuth2
 * (Utilisé en interne)
 */
export interface GmailProviderRequest extends JwtRequest {
  provider: GmailProvider;
}
