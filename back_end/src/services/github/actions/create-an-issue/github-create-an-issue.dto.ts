export interface GithubCreateAnIssueActionPayload {
  owner: string;
  repository: string;
  title: string;
  content: string;
  assignees: string;
  labels: string;
}
