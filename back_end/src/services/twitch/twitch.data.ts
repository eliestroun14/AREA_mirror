import { constants } from '@config/utils';
import { Service } from '@root/prisma/services-data/services.dto';
import { twitchFollowNewChannelData } from '@root/services/twitch/triggers/follow-new-channel/twitch-follow-new-channel.data';
import { twitchNewFollowerOnYourChannelData } from '@root/services/twitch/triggers/new-follower-on-your-channel/twitch-new-follower-on-your-channel.data';
import { twitchNewVideoPostedByYouData } from '@root/services/twitch/triggers/new-video-posted-by-you/twitch-new-video-posted-by-you.data';

export const twitchData: Service = {
  name: constants.services.twitch.name,
  slug: constants.services.twitch.slug,
  serviceColor: '#6441a5',
  iconUrl: '/assets/twitch.png',
  apiBaseUrl: 'https://api.twitch.tv/helix',
  authType: 'oauth2',
  documentationUrl: 'https://dev.twitch.tv/docs',
  isActive: true,
  triggers: [
    twitchFollowNewChannelData,
    twitchNewFollowerOnYourChannelData,
    twitchNewVideoPostedByYouData,
  ],
  actions: [],
};
