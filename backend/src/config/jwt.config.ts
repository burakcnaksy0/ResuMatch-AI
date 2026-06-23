// src/config/jwt.config.ts
import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  accessSecret:
    process.env.JWT_ACCESS_SECRET ??
    'super-secret-access-key-change-in-production',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  refreshSecret:
    process.env.JWT_REFRESH_SECRET ??
    'super-secret-refresh-key-change-in-production',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
}));
