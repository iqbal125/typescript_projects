import * as Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'staging')
        .default('development'),
    PORT: Joi.number().port().default(3000),
    HOST: Joi.string().default('0.0.0.0'),
    APP_NAME: Joi.string().default('NestJS Advanced API'),
    APP_VERSION: Joi.string().default('1.0.0'),
    DATABASE_URL: Joi.string().required().description('Database connection URL'),
    JWT_SECRET: Joi.string()
        .min(32)
        .default('default-secret-change-me-in-production'),
    JWT_EXPIRATION: Joi.string()
        .default('24h')
        .pattern(/^(\d+)(s|m|h|d)$/)
        .description('JWT expiration time (e.g., 30s, 5m, 24h, 7d)'),
    SWAGGER_TITLE: Joi.string().default('API Documentation'),
    SWAGGER_DESCRIPTION: Joi.string().default('API Description'),
    SWAGGER_VERSION: Joi.string().default('1.0'),
    CORS_ENABLED: Joi.boolean().default(true),
    CORS_ORIGIN: Joi.string().default('*').description('Allowed CORS origins (use * for all origins)'),
    LOG_LEVEL: Joi.string()
        .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace')
        .default('info')
        .description('Pino log level'),
});