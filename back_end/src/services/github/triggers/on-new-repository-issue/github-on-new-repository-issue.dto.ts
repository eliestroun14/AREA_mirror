export type GithubOnNewRepositoryIssueTriggerPayload = {
  owner: string;
  repository: string;
};

export type GithubOnNewRepositoryIssueBody = {
  action: string;
  issue: {
    html_url: string;
    title: string;
    body: string;
    number: number;
    user: {
      login: string;
      html_url: string;
    };
    state: string;
    type?: {
      name: string;
      description: string;
    };
  };
  repository: {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string;
    private: boolean;
    owner: {
      login: string;
      html_url: string;
      type: string;
    };
  };
  sender: {
    login: string;
    html_url: string;
  };
};
export type GithubOnNewRepositoryIssueHeaders = object;
export type GithubOnNewRepositoryIssueQueries = object;
