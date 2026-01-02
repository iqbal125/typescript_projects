import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './database/prisma.module';
import { LoggerModule } from './common/logger/logger.module';
import { configModuleOpts } from './global/config';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOpts),
    LoggerModule,
    PrismaModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
