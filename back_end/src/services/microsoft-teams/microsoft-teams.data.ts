import { constants } from '@config/utils';
import { Service } from '@root/prisma/services-data/services.dto';

export const microsoftTeamsData: Service = {
  name: constants.services.microsoftTeams.name,
  slug: constants.services.microsoftTeams.slug,
  serviceColor: '#464EB8',
  iconUrl: '/assets/microsoft-teams.png',
  apiBaseUrl: 'https://graph.microsoft.com',
  authType: 'oauth2',
  documentationUrl:
    'https://docs.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0',
  isActive: true,
  triggers: [],
  actions: [],
};
