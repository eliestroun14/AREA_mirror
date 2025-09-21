import '@config/env';

export const envConstants = {
  jwtSecret: process.env.JWT_SECRET ?? 'JWT_SECRET',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? '10'),

  google_client_id: process.env.GOOGLE_CLIENT_ID ?? 'GOOGLE_CLIENT_ID',
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET ?? 'GOOGLE_SECRET',

  deezer_client_id: process.env.DEEZER_CLIENT_ID ?? 'DEEZER_CLIENT_ID',
  deezer_client_secret: process.env.DEEZER_CLIENT_SECRET ?? 'DEEZER_SECRET',

  spotify_client_id: process.env.SPOTIFY_CLIENT_ID ?? 'SPOTIFY_CLIENT_ID',
  spotify_client_secret: process.env.SPOTIFY_CLIENT_SECRET ?? 'SPOTIFY_SECRET',
};
