import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { securityHeaders, getCorsOptions } from './global/security';
import { setupSwagger } from './global/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  // Set Pino as the logger
  app.useLogger(app.get(Logger));

  // CORS
  app.enableCors(getCorsOptions(configService));

  // Security - Helmet middleware
  app.use(helmet(securityHeaders));

  // Swagger Configuration
  setupSwagger(app);

  const port = configService.get<number>('app.port')!;
  const host = configService.get<string>('app.host')!;

  await app.listen(port, host);

  const logger = app.get(Logger);
  logger.log(`Application is running on: http://${host}:${port}`, 'Bootstrap');
  logger.log(`Swagger documentation available at: http://${host}:${port}/api`, 'Bootstrap');
}
bootstrap();
