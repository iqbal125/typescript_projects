import { ConfigModuleOptions } from '@nestjs/config';
import { appConfig } from './app.config';
import { corsConfig } from './cors.config';
import { databaseConfig } from '../database/database.config';
import { jwtConfig } from './jwt.config';
import { loggerConfig } from './logger.config';
import { swaggerConfig } from './swagger.config';
import { validationSchema } from './validation.schema';

export const configModuleOpts: ConfigModuleOptions = {
  isGlobal: true,
  load: [appConfig, databaseConfig, jwtConfig, swaggerConfig, corsConfig, loggerConfig],
  envFilePath: '.env',
  cache: true,
  validationSchema,
  validationOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};