import { githubOnNewIssueData } from '@root/services/github/triggers/on-new-issue/github-on-new-issue.data';
import { githubOnNewRepositoryData } from '@root/services/github/triggers/on-new-repository/github-on-new-repository.data';
import { constants } from '@config/utils';
import { Service } from '@root/prisma/services-data/services.dto';
import { githubSendMessageData } from '@root/services/github/actions/send-message/github-send-message.data';

export const githubData: Service = {
  name: constants.services.github.name,
  slug: constants.services.github.slug,
  serviceColor: '#1C1C1C',
  iconUrl: '/assets/github.png',
  apiBaseUrl: '',
  authType: 'oauth2',
  documentationUrl: '',
  isActive: true,
  triggers: [githubOnNewIssueData, githubOnNewRepositoryData],
  actions: [githubSendMessageData],
};
