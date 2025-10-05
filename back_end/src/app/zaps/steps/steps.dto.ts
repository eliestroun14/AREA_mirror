export interface StepDTO {
  id: number;
  zap_id: number;
  connection_id: number;
  step_type: 'TRIGGER' | 'ACTION';
  trigger_id: number | null;
  action_id: number | null;
  step_order: number;
  payload: object;
  created_at: Date;
  updated_at: Date;
}
