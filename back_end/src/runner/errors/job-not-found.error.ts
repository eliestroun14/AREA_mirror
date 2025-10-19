export default class JobNotFoundError extends Error {
  constructor(
    jobId: number,
    jobClassName: string,
    jobType: 'action' | 'trigger',
  ) {
    super(`Class '${jobClassName}' of ${jobType}:${jobId} not found.`);
  }
}
