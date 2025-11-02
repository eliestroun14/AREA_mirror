import { constants } from '@config/utils';
import { Service } from '@root/prisma/services-data/services.dto';

export const googleOauthLoginData: Service = {
  name: constants.services.googleOauthLogin.name,
  slug: constants.services.googleOauthLogin.slug,
  serviceColor: '#FFFFFF',
  iconUrl: '',
  apiBaseUrl: '',
  authType: 'oauth2',
  documentationUrl: '',
  isActive: false,
  triggers: [],
  actions: [],
};
