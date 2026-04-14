import { registerAs } from '@nestjs/config';
import type { ServerEnv } from '@org/server-config/env';

export interface AppConfig {
  nodeEnv: ServerEnv['NODE_ENV'];
  port: number;
  host: string;
  appName: string;
  appVersion: string;
}

export const appConfig = registerAs('app', (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV as ServerEnv['NODE_ENV'],
  port: Number.parseInt(process.env.BACKEND_PORT as string, 10),
  host: process.env.BACKEND_HOST as string,
  appName: process.env.APP_NAME as string,
  appVersion: process.env.APP_VERSION as string,
}));