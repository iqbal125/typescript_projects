import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
    const configService = app.get(ConfigService);

    const swaggerTitle = configService.get<string>('swagger.title')!;
    const swaggerDescription = configService.get<string>('swagger.description')!;
    const swaggerVersion = configService.get<string>('swagger.version')!;

    const config = new DocumentBuilder()
        .setTitle(swaggerTitle)
        .setDescription(swaggerDescription)
        .setVersion(swaggerVersion)
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
}
