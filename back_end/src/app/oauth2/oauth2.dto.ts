import { JwtPayload } from '@app/auth/jwt/jwt.dto';

export interface OAuth2Provider {
  connection_name: string;
  account_identifier: string;
  scopes: string[];
  access_token: string;
  refresh_token: string | null;
  expires_at: Date | null;
  rate_limit_remaining: number | undefined;
  rate_limit_reset: Date | null;
}

export interface StrategyCallbackRequest extends Request {
  provider: OAuth2Provider;
  user: JwtPayload;
}
