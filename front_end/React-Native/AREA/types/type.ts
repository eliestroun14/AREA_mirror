export interface Service {
  id: number;
  name: string;
  slug: string;
  icon_url: string;
  api_base_url: string;
  services_color: string;
  auth_type: string;
  documentation_url: string;
  is_active: boolean;
  created_at: string;
  triggers: Trigger[];
  actions: Action[];
  applets: AppletsCard[];
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

export interface Trigger {
  id: number;
  service_id: number;
  http_request_id?: number | null;
  webhook_id?: number | null;
  trigger_type: string;
  name: string;
  description: string;
  polling_interval?: number | null;
  fields: Record<string, any>;
  variables: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Action {
  id: number;
  service_id: number;
  http_request_id: number;
  name: string;
  description: string;
  fields: Record<string, any>;
  variables: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Zap {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}