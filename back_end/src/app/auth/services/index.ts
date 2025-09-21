interface Service {
  name: string;
  iconUrl: string;
  apiBaseUrl: string;
  authType: "oauth2" | "api_key" | "basic";
  documentationUrl: string;
  isActive: boolean;
}

export interface ServiceProviderData {
  provider: string;
  providerId: string;
  username: string;
  picture: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export const services: Service[] = [
  {
    name: 'Spotify',
    iconUrl: '/assets/spotify.png',
    apiBaseUrl: 'https://api.spotify.com/',
    authType: 'oauth2',
    documentationUrl: 'https://developer.spotify.com/documentation/',
    isActive: true
  },
  {
    name: 'Deezer',
    iconUrl: '/assets/deezer.png',
    apiBaseUrl: 'https://api.deezer.com/',
    authType: 'oauth2',
    documentationUrl: 'https://developers.deezer.com/api/',
    isActive: true
  },
  {
    name: 'Google',
    iconUrl: '/assets/google.png',
    apiBaseUrl: 'https://www.googleapis.com/',
    authType: 'oauth2',
    documentationUrl: 'https://developers.google.com/',
    isActive: true
  }
]