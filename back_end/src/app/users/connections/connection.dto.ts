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