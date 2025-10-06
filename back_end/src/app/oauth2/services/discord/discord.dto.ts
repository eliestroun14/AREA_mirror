import { ApiProperty } from '@nestjs/swagger';
import { JwtRequest } from '@app/auth/jwt/jwt.dto';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

/**
 * Informations du provider Discord après authentification OAuth2
 */
export class DiscordProvider extends OAuth2Provider {
  @ApiProperty({
    description: 'Email du compte Discord',
    example: 'user@discord.com',
  })
  email: string;

  @ApiProperty({
    description: 'Username Discord',
    example: 'DiscordUser#1234',
  })
  username: string;

  @ApiProperty({
    description: "URL de l'avatar Discord",
    example: 'https://cdn.discordapp.com/avatars/123456/abcdef.png',
  })
  picture: string;
}

/**
 * Requête contenant les informations Discord après OAuth2
 * (Utilisé en interne)
 */
export interface DiscordProviderRequest extends JwtRequest {
  provider: DiscordProvider;
}
