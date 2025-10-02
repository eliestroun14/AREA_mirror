export interface AddZapTriggerStepDTO {
  zap_id: number;
  step_order: number;
  trigger_id: number;
  payload?: any;
  source_step_id?: number | null;
}
