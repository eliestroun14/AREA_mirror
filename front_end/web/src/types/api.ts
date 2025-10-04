// Types for backend API responses
export interface ServiceDTO {
  id: number;
  name: string;
  icon_url: string | null;
  api_base_url: string | null;
  services_color: string;
  auth_type: string;
  documentation_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ActionDTO {
  id: number;
  service_id: number;
  http_request_id: number;
  name: string;
  description: string;
  fields: unknown;
  variables: unknown;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TriggerDTO {
  id: number;
  service_id: number;
  http_request_id: number | null;
  webhook_id: number | null;
  trigger_type: string;
  name: string;
  description: string;
  polling_interval: number | null;
  fields: unknown;
  variables: unknown;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// API Response types
export type GetAllServicesResponse = ServiceDTO[];
export type GetServiceResponse = ServiceDTO;
export type GetTriggersByServiceResponse = TriggerDTO[];
export type GetActionsByServiceResponse = ActionDTO[];
export type GetActionByServiceResponse = ActionDTO | null;
export type GetTriggerByServiceResponse = TriggerDTO | null;
