import { registerAs } from '@nestjs/config';

export interface JwtConfig {
    secret: string;
    expiration: string;
}

export const jwtConfig = registerAs('jwt', (): JwtConfig => ({
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expiration: process.env.JWT_EXPIRATION || '24h',
}));