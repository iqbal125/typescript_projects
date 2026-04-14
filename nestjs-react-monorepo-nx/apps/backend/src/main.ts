import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { securityHeaders, getCorsOptions } from './config/security.config';
import { setupSwagger } from './config/swagger.config';
import { ZodValidationPipe, cleanupOpenApiDoc } from 'nestjs-zod';
import { VersioningType } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle("Example API").setDescription("Example API description").setVersion("1.0").build()
  );

  SwaggerModule.setup("api", app, cleanupOpenApiDoc(openApiDoc));
  const configService = app.get(ConfigService);

  // Set Pino as the logger
  app.useLogger(app.get(Logger));

  // CORS
  app.enableCors(getCorsOptions(configService));

  // Security - Helmet middleware
  app.use(helmet(securityHeaders));

  // API versioning
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Swagger Configuration
  setupSwagger(app);


  // Global validation pipe (nestjs-zod)
  app.useGlobalPipes(new ZodValidationPipe());


  const port = configService.getOrThrow<number>('app.port');
  const host = configService.getOrThrow<string>('app.host');

  await app.listen(port, host);

  const logger = app.get(Logger);
  logger.log(`Application is running on: http://${host}:${port}`, 'Bootstrap');
  logger.log(`Swagger documentation available at: http://${host}:${port}`, 'Bootstrap');
}
bootstrap();
