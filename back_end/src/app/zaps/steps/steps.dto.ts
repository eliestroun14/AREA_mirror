import { connections, triggers, actions } from '@prisma/client';

export interface StepDTO {
  id: number;
  zap_id: number;
  connection: connections;
  step_type: 'TRIGGER' | 'ACTION';
  trigger: triggers | null;
  action: actions | null;
  step_order: number;
  payload: object;
  created_at: Date;
  updated_at: Date;
}
