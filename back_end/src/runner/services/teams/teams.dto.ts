// DTOs pour les triggers Teams
export interface TeamsTrigger_OnNewMessage_Payload {
  team_id: string;
  channel_id: string;
}

// DTOs pour les actions Teams
export interface TeamsSendMessageActionPayload {
  team_id: string;
  channel_id: string;
  message: string;
}

export interface TeamsSendReactionActionPayload {
  team_id: string;
  channel_id: string;
  message_id: string;
  reaction: string;
}
