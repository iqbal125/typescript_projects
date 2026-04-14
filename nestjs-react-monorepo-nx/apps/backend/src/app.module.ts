import { ZodValidationPipe, ZodSerializerInterceptor, ZodSerializationException } from "nestjs-zod";
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER, BaseExceptionFilter } from "@nestjs/core";
import { ZodError } from "zod";
import { Module, HttpException, ArgumentsHost, Logger, Catch } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { DrizzleModule } from './database/drizzle.module';
import { LoggerModule } from './common/logger/logger.module';
import { configModuleOpts } from './config/config.module-options';
import { TodoModule } from './modules/todo/todo.module';

@Catch(HttpException)
class HttpExceptionFilter extends BaseExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  override catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError();

      if (zodError instanceof ZodError) {
        this.logger.error(`ZodSerializationException: ${zodError.message}`);
      }
    }

    super.catch(exception, host);
  }
}

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOpts),
    LoggerModule,
    DrizzleModule,
    HealthModule,
    TodoModule
  ],
  controllers: [],
  providers: [{
    provide: APP_PIPE,
    useClass: ZodValidationPipe
  }, {
    provide: APP_INTERCEPTOR,
    useClass: ZodSerializerInterceptor
  }, {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter
  }],
})
export class AppModule { }
