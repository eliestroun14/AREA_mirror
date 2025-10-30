import { constants } from '@config/utils';
import { Service } from '@root/prisma/services-data/services.dto';

export const twitchData: Service = {
  name: constants.services.twitch.name,
  slug: constants.services.twitch.slug,
  serviceColor: '#6441a5',
  iconUrl: '/assets/twitch.png',
  apiBaseUrl: 'https://api.twitch.tv/helix',
  authType: 'oauth2',
  documentationUrl: 'https://dev.twitch.tv/docs',
  isActive: true,
  triggers: [],
  actions: [],
};
