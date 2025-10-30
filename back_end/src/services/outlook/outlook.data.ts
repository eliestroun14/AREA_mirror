import { constants } from '@config/utils';
import { Service } from '@root/prisma/services-data/services.dto';
import { outlookOnEmailReceiveData } from '@root/services/outlook/triggers/on-email-receive/outlook-on-email-receive.data';

export const outlookData: Service = {
  name: constants.services.outlook.name,
  slug: constants.services.outlook.slug,
  serviceColor: '#0078D4',
  iconUrl: '/assets/outlook.png',
  apiBaseUrl: 'https://graph.microsoft.com/v1.0',
  authType: 'oauth2',
  documentationUrl: 'https://learn.microsoft.com/en-us/graph/api/resources/mail-api-overview',
  isActive: true,
  triggers: [
    outlookOnEmailReceiveData,
  ],
  actions: [],
};
