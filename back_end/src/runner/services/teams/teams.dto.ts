// DTOs pour les triggers Teams
export interface TeamsTrigger_OnNewMessage_Payload {
  team_id: string;
  channel_id: string;
}

// DTOs pour les actions Teams
export interface TeamsAction_SendMessage_Payload {
  team_id: string;
  channel_id: string;
  message: string;
}

export interface TeamsAction_SendReaction_Payload {
  team_id: string;
  channel_id: string;
  message_id: string;
  reaction: string;
}
