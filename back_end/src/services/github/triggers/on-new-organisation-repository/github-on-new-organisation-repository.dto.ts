export type GithubOnNewOrganisationRepositoryTriggerPayload = {
  organisation: string;
};

export type GithubOnNewOrganisationRepositoryBody = {
  action: string;
  repository: {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string;
    private: boolean;
  };
  organization: {
    login: string;
  };
  sender: {
    login: string;
    html_url: string;
  };
};
export type GithubOnNewOrganisationRepositoryHeaders = object;
export type GithubOnNewOrganisationRepositoryQueries = object;
