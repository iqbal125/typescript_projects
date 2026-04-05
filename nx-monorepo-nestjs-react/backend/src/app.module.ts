import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { DrizzleModule } from './database/drizzle.module';
import { LoggerModule } from './common/logger/logger.module';
import { configModuleOpts } from './global/config';
import { TodoModule } from './modules/todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOpts),
    LoggerModule,
    DrizzleModule,
    HealthModule,
    TodoModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
