import {
  OAuth2Provider,
  StrategyCallbackRequest,
} from '@app/oauth2/oauth2.dto';

export interface GoogleOAuth2Provider extends OAuth2Provider {
  displayName: string;
  name: { familyName: string; givenName: string };
  emails: { value: string; verified: boolean }[];
  photos: { value: string }[];
}

export interface GoogleStrategyCallbackRequest extends StrategyCallbackRequest {
  provider: GoogleOAuth2Provider;
}
