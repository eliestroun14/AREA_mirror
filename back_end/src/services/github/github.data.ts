import { constants } from '@config/utils';
import { Service } from '@root/prisma/services-data/services.dto';
import { githubOnNewOrganisationRepositoryData } from '@root/services/github/triggers/on-new-organisation-repository/github-on-new-organisation-repository.data';
import { githubOnNewPersonnalRepositoryData } from '@root/services/github/triggers/on-new-personnal-repository/github-on-new-personnal-repository.data';
import { githubOnNewRepositoryIssueData } from '@root/services/github/triggers/on-new-repository-issue/github-on-new-repository-issue.data';
import { githubOnCommitData } from '@root/services/github/triggers/on-commit/github-on-commit.data';
import { githubCreateAnIssueData } from '@root/services/github/actions/create-an-issue/github-create-an-issue.data';

export const githubData: Service = {
  name: constants.services.github.name,
  slug: constants.services.github.slug,
  serviceColor: '#1C1C1C',
  iconUrl: '/assets/github.png',
  apiBaseUrl: '',
  authType: 'oauth2',
  documentationUrl: '',
  isActive: true,
  triggers: [
    githubOnNewOrganisationRepositoryData,
    githubOnNewPersonnalRepositoryData,
    githubOnNewRepositoryIssueData,
    githubOnCommitData,
  ],
  actions: [
    githubCreateAnIssueData,
  ],
};
