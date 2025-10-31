// Types for backend API responses
export interface ServiceDTO {
  id: number;
  name: string;
  slug: string;
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
  fields: Record<string, unknown>;
  variables: Record<string, unknown>;
  require_connection: boolean;
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
  fields: Record<string, unknown>;
  variables: Record<string, unknown>;
  require_connection: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConnectionDTO {
  id: number;
  service_id: number;
  service_name: string;
  service_color: string | null;
  icon_url: string | null;
  connection_name: string | null;
  account_identifier: string | null;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

export interface ZapDTO {
  id: number;
  user_id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActivityDTO {
  type: string;
  title: string;
  description?: string | null;
  created_at: string;
  meta?: Record<string, unknown> | null;
}

// API Response types
export type GetAllServicesResponse = ServiceDTO[];
export type GetServiceResponse = ServiceDTO;
export type GetTriggersByServiceResponse = TriggerDTO[];
export type GetActionsByServiceResponse = ActionDTO[];
export type GetActionByServiceResponse = ActionDTO | null;
export type GetTriggerByServiceResponse = TriggerDTO | null;
export type GetAllConnectionsResponse = { connections: ConnectionDTO[] };
export type GetConnectionsByServiceResponse = { connections: ConnectionDTO[] };
export type GetAllZapsResponse = ZapDTO[];
export type GetUserActivitiesResponse = { activities: ActivityDTO[] };
