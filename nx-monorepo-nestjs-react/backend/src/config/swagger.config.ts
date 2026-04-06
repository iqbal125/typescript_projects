import { INestApplication } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export interface SwaggerConfig {
    title: string;
    description: string;
    version: string;
}

export const swaggerConfig = registerAs('swagger', (): SwaggerConfig => ({
    title: process.env.SWAGGER_TITLE || 'API Documentation',
    description: process.env.SWAGGER_DESCRIPTION || 'API Description',
    version: process.env.SWAGGER_VERSION || '1.0',
}));

export function setupSwagger(app: INestApplication): void {
    const swaggerTitle = app.getOrThrow(swaggerConfig.KEY).title;
    const swaggerDescription = app.getOrThrow(swaggerConfig.KEY).description;
    const swaggerVersion = app.getOrThrow(swaggerConfig.KEY).version;

    const config = new DocumentBuilder()
        .setTitle(swaggerTitle)
        .setDescription(swaggerDescription)
        .setVersion(swaggerVersion)
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
}