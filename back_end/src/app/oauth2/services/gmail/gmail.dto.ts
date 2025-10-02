import { JwtRequest } from '@app/auth/jwt/jwt.dto';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

export interface GmailProvider extends OAuth2Provider {
  email: string;
  username: string;
  picture: string;
}

export interface GmailProviderRequest extends JwtRequest {
  provider: GmailProvider;
}
