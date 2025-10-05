// ==================
//        DTOs
// ==================

export interface ConnectionDTO {
  id: number;
  user_id: number;
  service_id: number;
  access_token: string;
  refresh_token: string | null;
  expires_at: Date | null;
}

export interface ConnectionResponseDTO {
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

export interface GetAllConnectionsResponse {
  connections: ConnectionResponseDTO[];
}

export interface GetConnectionsByServiceResponse {
  connections: ConnectionResponseDTO[];
}
