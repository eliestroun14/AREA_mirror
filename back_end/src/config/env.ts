import dotenv from 'dotenv';

dotenv.config();

export const envConstants = {
  jwtSecret: process.env.JWT_SECRET ?? 'JWT_SECRET',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? '10'),

  webhook_base_url: process.env.WEBHOOK_BASE_URL ?? 'none',
  api_base_url: process.env.API_BASE_URL ?? 'http://127.0.0.1:3000',
  web_oauth2_success_redirect_url:
    process.env.WEB_SUCCESS_OAUTH2_REDIRECT_URL ??
    'http://127.0.0.1/oauth2/success',
  web_home_url: process.env.WEB_HOME_URL ?? 'http://127.0.0.1/',

  mobile_oauth2_success_redirect_url:
    process.env.MOBILE_SUCCESS_OAUTH2_REDIRECT_URL ?? 'area://oauth2/success',
  mobile_home_url: process.env.MOBILE_HOME_URL ?? 'area://home',

  discord_client_id: process.env.DISCORD_CLIENT_ID ?? 'DISCORD_CLIENT_ID',
  discord_client_secret: process.env.DISCORD_CLIENT_SECRET ?? 'DISCORD_SECRET',

  github_client_id: process.env.GITHUB_CLIENT_ID ?? 'GITHUB_CLIENT_ID',
  github_client_secret: process.env.GITHUB_CLIENT_SECRET ?? 'GITHUB_SECRET',

  google_client_id: process.env.GOOGLE_CLIENT_ID ?? 'GOOGLE_CLIENT_ID',
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET ?? 'GOOGLE_SECRET',

  deezer_client_id: process.env.DEEZER_CLIENT_ID ?? 'DEEZER_CLIENT_ID',
  deezer_client_secret: process.env.DEEZER_CLIENT_SECRET ?? 'DEEZER_SECRET',

  spotify_client_id: process.env.SPOTIFY_CLIENT_ID ?? 'SPOTIFY_CLIENT_ID',
  spotify_client_secret: process.env.SPOTIFY_CLIENT_SECRET ?? 'SPOTIFY_SECRET',

  google_calendar_client_id:
    process.env.GOOGLE_CALENDAR_CLIENT_ID ?? 'GOOGLE_CALENDAR_CLIENT_ID',
  google_calendar_client_secret:
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET ?? 'GOOGLE_CALENDAR_SECRET',

  twitch_client_id: process.env.TWITCH_CLIENT_ID ?? 'TWITCH_CLIENT_ID',
  twitch_client_secret: process.env.TWITCH_CLIENT_SECRET ?? 'TWITCH_SECRET',

  microsoft_teams_client_id: process.env.TEAMS_CLIENT_ID ?? 'TEAMS_CLIENT_ID',
  microsoft_teams_client_secret:
    process.env.TEAMS_CLIENT_SECRET ?? 'TEAMS_CLIENT_SECRET',

  microsoft_onedrive_client_id: process.env.MICROSOFT_ONEDRIVE_CLIENT_ID ?? 'MICROSOFT_ONEDRIVE_CLIENT_ID',
  microsoft_onedrive_client_secret:
    process.env.MICROSOFT_ONEDRIVE_CLIENT_SECRET ?? 'MICROSOFT_ONEDRIVE_CLIENT_SECRET',

  token_encryption_key:
    process.env.TOKEN_ENCRYPTION_KEY ??
    '331240132d30fe6405292ee8dffb7f8dafe19585afd9f1e2fac0607f6cb3c408',

  youtube_client_id: process.env.YOUTUBE_CLIENT_ID ?? 'YOUTUBE_CLIENT_ID',
  youtube_client_secret: process.env.YOUTUBE_CLIENT_SECRET ?? 'YOUTUBE_SECRET',

  google_drive_client_id: process.env.DRIVE_CLIENT_ID ?? 'DRIVE_CLIENT_ID',
  google_drive_client_secret: process.env.DRIVE_CLIENT_SECRET ?? 'DRIVE_SECRET',
};
