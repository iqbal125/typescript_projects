import { registerAs } from '@nestjs/config';

export interface LoggerConfig {
  level: string;
}

export const loggerConfig = registerAs('logger', (): LoggerConfig => ({
  level: process.env.LOG_LEVEL as string,
}));