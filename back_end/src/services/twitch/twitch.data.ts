import { constants } from '@config/utils';
import { Service } from '@root/prisma/services-data/services.dto';
import { twitchFollowNewChannelData } from '@root/services/twitch/triggers/follow-new-channel/twitch-follow-new-channel.data';

export const twitchData: Service = {
  name: constants.services.twitch.name,
  slug: constants.services.twitch.slug,
  serviceColor: '#6441a5',
  iconUrl: '/assets/twitch.png',
  apiBaseUrl: 'https://api.twitch.tv/helix',
  authType: 'oauth2',
  documentationUrl: 'https://dev.twitch.tv/docs',
  isActive: true,
  triggers: [twitchFollowNewChannelData],
  actions: [],
};
