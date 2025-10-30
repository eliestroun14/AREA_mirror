import { constants } from '@config/utils';
import { Service } from '@root/prisma/services-data/services.dto';
import { discordSendMessageData } from '@root/services/discord/actions/send-message/discord-send-message.data';

export const discordData: Service = {
  name: constants.services.discord.name,
  slug: constants.services.discord.slug,
  serviceColor: '#7289da',
  iconUrl: '/assets/discord.png',
  apiBaseUrl: 'https://discord.com/api',
  authType: 'oauth2',
  documentationUrl: 'https://discord.com/developers/docs/reference/',
  isActive: true,
  triggers: [],
  actions: [discordSendMessageData],
};
