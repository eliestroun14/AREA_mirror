import '@config/env';

export const secretConstants = {
  jwt: process.env.JWT_SECRET ?? 'JWT_SECRET',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? '10'),
};
