export type TwitchFollowNewChannelPollPayload = Record<string, never>;

export interface TwitchFollowNewChannelPollComparisonData {
  followed_channel_ids: string[];
}

export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
}

export interface TwitchUserResponse {
  data: TwitchUser[];
}

export interface TwitchFollowedChannel {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  followed_at: string;
}

export interface TwitchFollowedChannelsResponse {
  data: TwitchFollowedChannel[];
  total: number;
  pagination?: {
    cursor?: string;
  };
}
