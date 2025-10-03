import { Service } from '@root/prisma/services-data/services.dto';

export const services = {
  gmail: { name: 'Gmail', slug: 'gmail' },
  github: { name: 'Github', slug: 'github' },
  discord: { name: 'Discord', slug: 'discord' },
};

export const servicesData: Service[] = [
  {
    name: services.discord.name,
    serviceColor: '#7289da',
    iconUrl: '/assets/discord.png',
    apiBaseUrl: 'https://discord.com/api',
    authType: 'oauth2',
    documentationUrl: 'https://discord.com/developers/docs/reference/',
    isActive: true,
  },
  {
    name: services.github.name,
    serviceColor: '#21262d',
    iconUrl: '/assets/github.png',
    apiBaseUrl: 'https://api.github.com',
    authType: 'oauth2',
    documentationUrl: 'https://docs.github.com/en/rest/',
    isActive: true,
  },
  {
    name: services.gmail.name,
    serviceColor: '#4285F4',
    iconUrl: '/assets/gmail.png',
    apiBaseUrl: 'https://gmail.googleapis.com',
    authType: 'oauth2',
    documentationUrl:
      'https://developers.google.com/workspace/gmail/api/reference/rest',
    isActive: true,
  },
];
