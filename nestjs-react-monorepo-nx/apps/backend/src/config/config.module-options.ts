import { ConfigModuleOptions } from '@nestjs/config';
import { appConfig } from './app.config';
import { corsConfig } from './cors.config';
import { databaseConfig } from './database.config';
import { jwtConfig } from './jwt.config';
import { loggerConfig } from './logger.config';
import { swaggerConfig } from './swagger.config';
import { validateServerEnv } from './validation.schema';

const envFilePath = process.env.ENV_FILE ?? '.env.local';

export const configModuleOpts: ConfigModuleOptions = {
  isGlobal: true,
  load: [appConfig, databaseConfig, jwtConfig, swaggerConfig, corsConfig, loggerConfig],
  envFilePath,
  cache: true,
  validate: validateServerEnv,
};