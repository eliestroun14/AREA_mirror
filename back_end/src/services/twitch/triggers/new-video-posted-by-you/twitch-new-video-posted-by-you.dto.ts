export type TwitchNewVideoPostedByYouPollPayload = Record<string, never>;

export interface TwitchNewVideoPostedByYouPollComparisonData {
  lastVideoIds: string[];
}

export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
}

export interface TwitchUsersResponse {
  data: TwitchUser[];
}

export interface TwitchVideo {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  title: string;
  description: string;
  created_at: string;
  published_at: string;
  url: string;
  thumbnail_url: string;
  viewable: string;
  view_count: number;
  language: string;
  type: string;
  duration: string;
}

export interface TwitchVideosResponse {
  data: TwitchVideo[];
  pagination?: {
    cursor?: string;
  };
}