// src/config/openai.config.ts
import { registerAs } from '@nestjs/config';

export const openaiConfig = registerAs('openai', () => ({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseUrl: process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1',
  defaultModel: process.env.OPENROUTER_DEFAULT_MODEL ?? 'openai/gpt-4o',
  fallbackModel: process.env.OPENROUTER_FALLBACK_MODEL ?? 'openai/gpt-4o-mini',
}));
