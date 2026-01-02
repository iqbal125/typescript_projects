import { Module, } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { TodoModule } from './modules/todo/todo.module';
import { PrismaModule } from './database/prisma.module';
import {
  appConfig,
  databaseConfig,
  swaggerConfig,
  corsConfig,
  validationSchema,
} from './utils/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, swaggerConfig, corsConfig],
      envFilePath: '.env',
      cache: true,
      validationSchema: validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    HealthModule,
    TodoModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
