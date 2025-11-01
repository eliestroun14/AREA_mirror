export type TwitchStreamGoingLiveChannelYouFollowPollPayload = Record<
  string,
  never
>;

export interface TwitchStreamGoingLiveChannelYouFollowPollComparisonData {
  lastLiveStreamIds: string[];
}

export interface TwitchFollowedStream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  title: string;
  game_id?: string;
  game_name?: string;
  viewer_count: number;
  started_at: string;
  language?: string;
  thumbnail_url?: string;
}

export interface TwitchFollowedStreamsResponse {
  data: TwitchFollowedStream[];
  pagination?: { cursor?: string };
}
