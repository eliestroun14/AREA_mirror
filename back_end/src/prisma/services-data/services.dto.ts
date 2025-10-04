export interface Service {
  name: string;
  serviceColor: string;
  iconUrl: string;
  apiBaseUrl: string;
  authType: 'oauth2' | 'api_key' | 'basic';
  documentationUrl: string;
  isActive: boolean;
}
