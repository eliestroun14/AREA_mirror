import dotenv from 'dotenv';

dotenv.config();

export const envConstants = {
  jwtSecret: process.env.JWT_SECRET ?? 'JWT_SECRET',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? '10'),

  api_base_url: process.env.API_BASE_URL ?? 'http://127.0.0.1:3000',
  web_oauth2_success_redirect_url:
    process.env.WEB_SUCCESS_OAUTH2_REDIRECT_URL ??
    'http://127.0.0.1/oauth2/success',

  discord_client_id: process.env.DISCORD_CLIENT_ID ?? 'DISCORD_CLIENT_ID',
  discord_client_secret: process.env.DISCORD_CLIENT_SECRET ?? 'DISCORD_SECRET',

  google_client_id: process.env.GOOGLE_CLIENT_ID ?? 'GOOGLE_CLIENT_ID',
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET ?? 'GOOGLE_SECRET',

  deezer_client_id: process.env.DEEZER_CLIENT_ID ?? 'DEEZER_CLIENT_ID',
  deezer_client_secret: process.env.DEEZER_CLIENT_SECRET ?? 'DEEZER_SECRET',

  spotify_client_id: process.env.SPOTIFY_CLIENT_ID ?? 'SPOTIFY_CLIENT_ID',
  spotify_client_secret: process.env.SPOTIFY_CLIENT_SECRET ?? 'SPOTIFY_SECRET',
};
