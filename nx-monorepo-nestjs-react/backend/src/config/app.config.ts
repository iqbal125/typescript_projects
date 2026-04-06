import { registerAs } from '@nestjs/config';

export interface AppConfig {
    nodeEnv: string;
    port: number;
    host: string;
    appName: string;
    appVersion: string;
}

export const appConfig = registerAs('app', (): AppConfig => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    appName: process.env.APP_NAME || 'NestJS Advanced API',
    appVersion: process.env.APP_VERSION || '1.0.0',
}));