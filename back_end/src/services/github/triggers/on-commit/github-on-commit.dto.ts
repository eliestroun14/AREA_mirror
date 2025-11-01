export type GithubOnCommitTriggerPayload = {
  owner: string;
  repository: string;
};

export type GithubOnCommitBody = {
  ref: string;
  before: string;
  after: string;
  repository: {
    id: number;
    name: string;
    full_name: string;
    description: string;
    private: boolean;
    html_url: string;
  };
  pusher: {
    name: string;
    email: string;
  };
  commits: {
    id: string;
    message: string;
    timestamp: string;
    url: string;
    author: {
      name: string;
      email: string;
    };
  }[];
  head_commit: {
    id: string;
    message: string;
    url: string;
  };
};
export type GithubOnCommitHeaders = object;
export type GithubOnCommitQueries = object;
