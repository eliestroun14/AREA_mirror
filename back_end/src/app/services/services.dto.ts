// Service DTO
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

// Action DTO
export interface ActionDTO {
  id: number;
  service_id: number;
  http_request_id: number;
  name: string;
  description: string;
  fields: any;
  variables: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Trigger DTO
export interface TriggerDTO {
  id: number;
  service_id: number;
  http_request_id: number | null;
  webhook_id: number | null;
  trigger_type: string;
  name: string;
  description: string;
  polling_interval: number | null;
  fields: any;
  variables: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// GET /services
export type GetAllServicesResponse = ServiceDTO[];

// GET /services/:serviceId
export type GetServiceResponse = ServiceDTO;

// GET /services/:serviceId/triggers
export type GetTriggersByServiceResponse = TriggerDTO[];

// GET /services/:serviceId/actions
export type GetActionsByServiceResponse = ActionDTO[];

// GET /services/:serviceId/actions/:actionId
export type GetActionByServiceResponse = ActionDTO | null;

// GET /services/:serviceId/triggers/:triggerId
export type GetTriggerByServiceResponse = TriggerDTO | null;
