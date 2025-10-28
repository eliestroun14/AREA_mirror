import { ApiProperty } from '@nestjs/swagger';
import { JwtRequest } from '@app/auth/jwt/jwt.dto';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

/**
 * Informations du provider Discord après authentification OAuth2
 */
export class GoogleCalendarProvider extends OAuth2Provider {
  email: string;
  username: string;
  picture: string;
}

/**
 * Requête contenant les informations GoogleCalendar après OAuth2
 * (Utilisé en interne)
 */
export interface GoogleCalendarProviderRequest extends JwtRequest {
  provider: GoogleCalendarProvider;
}