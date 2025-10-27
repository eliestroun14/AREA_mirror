export interface ServiceHttpRequest {
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
}

export interface ServiceTriggerWebhook {
  from_url: string;
  event: string;
  action: string;
  secret: string;
  total_received: number;
  last_received_at: number;
}

export interface ServiceField {
  key: string;
  required: boolean;
  type: 'string' | 'number' | 'date' | 'select';
  select_options: string[];
  field_name: string;
  default_value: string;
  placeholder: string;
  field_order: number;
  validation_rules: object;
  is_active: boolean;
}

export interface ServiceVariable {
  type: 'string' | 'number' | 'date';
  name: string;
  key: string;
}

export interface ServiceTrigger {
  class_name: string;
  http_requests: ServiceHttpRequest | null;
  webhook: ServiceTriggerWebhook | null;
  trigger_type: 'POLLING' | 'SCHEDULE' | 'WEBHOOK';
  name: string;
  description: string;
  require_connection: boolean;
  polling_interval: number | null;
  fields: Record<string, ServiceField>;
  variables: ServiceVariable[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceAction {
  class_name: string;
  http_requests: ServiceHttpRequest;
  name: string;
  description: string;
  require_connection: boolean;
  fields: Record<string, ServiceField>;
  variables: ServiceVariable[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Service {
  name: string;
  slug: string;
  serviceColor: string;
  iconUrl: string;
  apiBaseUrl: string;
  authType: 'oauth2' | 'api_key' | 'basic';
  documentationUrl: string;
  isActive: boolean;
  triggers: ServiceTrigger[];
  actions: ServiceAction[];
}
