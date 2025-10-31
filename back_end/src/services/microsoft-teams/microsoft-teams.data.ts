import { constants } from '@config/utils';
import { Service } from '@root/prisma/services-data/services.dto';
import { microsoftTeamsSendMessageData } from '@root/services/microsoft-teams/actions/send-message/microsoft-teams-send-message.data';
import { microsoftTeamsSendReactionData } from '@root/services/microsoft-teams/actions/send-reaction/microsoft-teams-send-reaction.data';
import { microsoftTeamsNewMessageData } from '@root/services/microsoft-teams/triggers/new-message/microsoft-teams-new-message.data';

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
  triggers: [
    microsoftTeamsNewMessageData,
  ],
  actions: [
    microsoftTeamsSendMessageData,
    microsoftTeamsSendReactionData,
  ],
};
