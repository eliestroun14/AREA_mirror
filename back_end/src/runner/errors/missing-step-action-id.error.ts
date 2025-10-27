export default class MissingStepActionIdError extends Error {
  constructor(zapId: number, stepId: number) {
    super(
      `Step#${stepId} of Zap#${zapId} has no action_id, but is of type 'action'.`,
    );
  }
}
