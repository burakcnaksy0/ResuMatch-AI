// src/config/app.config.ts
import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3001', 10),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  maxCvGenerationsPerHour: parseInt(
    process.env.MAX_CV_GENERATIONS_PER_HOUR ?? '5',
    10,
  ),
  maxProfileSizeKb: parseInt(process.env.MAX_PROFILE_SIZE_KB ?? '50', 10),
}));
