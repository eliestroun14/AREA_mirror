import { Service } from '@root/prisma/services-data/services.dto';

export const servicesData: Service[] = [
  {
    name: 'Discord',
    serviceColor: '#7289da',
    iconUrl: '/assets/discord.png',
    apiBaseUrl: 'https://discord.com/api',
    authType: 'oauth2',
    documentationUrl: 'https://discord.com/developers/docs/reference/',
    isActive: true,
  },
  {
    name: 'Github',
    serviceColor: '#21262d',
    iconUrl: '/assets/github.png',
    apiBaseUrl: 'https://api.github.com',
    authType: 'oauth2',
    documentationUrl: 'https://docs.github.com/en/rest/',
    isActive: true,
  },
  {
    name: 'Gmail',
    serviceColor: '#4285F4',
    iconUrl: '/assets/gmail.png',
    apiBaseUrl: 'https://gmail.googleapis.com',
    authType: 'oauth2',
    documentationUrl:
      'https://developers.google.com/workspace/gmail/api/reference/rest',
    isActive: true,
  },
];
