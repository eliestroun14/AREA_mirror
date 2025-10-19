export default class StepActionNotFoundError extends Error {
  constructor(stepId: number, actionId: number) {
    super(`Action#${actionId} required by Step#${stepId} not found.`);
  }
}
