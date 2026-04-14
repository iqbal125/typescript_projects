import { registerAs } from '@nestjs/config';

export interface CorsConfig {
  enabled: boolean;
  origin: string;
}

export const corsConfig = registerAs('cors', (): CorsConfig => ({
  enabled: process.env.CORS_ENABLED === 'true',
  origin: process.env.CORS_ORIGIN as string,
}));