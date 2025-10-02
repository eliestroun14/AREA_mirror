export interface Service {
  id: string;
  serviceName: string;
  backgroundColor: string;
  applets: string[];
  appDescription: string;
  serviceDescription: string;
  triggers: Trigger[];
}

export interface AppletsCard {
  id: number;
  description: string;
  appName: string;
  backgroundColor: string;
  firstIconId: string;
  secondeIconId: string;
  littleIconId: string;
  howItWorks: string;
}

export interface TriggerField {
  required: boolean;
  type: string;
  field_name: string;
  placeholder?: string;
  field_order: number;
  validation_rules?: Record<string, any>;
  active: boolean;
  options?: { label: string; value: string }[];
  default_value?: string;
}

export interface Trigger {
  id: string;
  name: string;
  description: string;
  service: string;
  fields: Partial<Record<string, TriggerField>>;
}

