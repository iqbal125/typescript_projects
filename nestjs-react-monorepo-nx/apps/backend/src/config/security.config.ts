import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { HelmetOptions } from 'helmet';

export const securityHeaders: HelmetOptions = {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
};

export const getCorsOptions = (configService: ConfigService): CorsOptions => ({
    origin: configService.getOrThrow<string>('cors.origin'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
});