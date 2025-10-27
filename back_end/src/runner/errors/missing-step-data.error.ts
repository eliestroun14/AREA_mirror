export default class MissingStepDataError extends Error {
  constructor(zapId: number, stepId: number, sourceStepId: number) {
    super(
      `Step#${stepId} of Zap#${zapId} needs data of Step#${sourceStepId}, but the Step#${sourceStepId} has not been executed.`,
    );
  }
}
