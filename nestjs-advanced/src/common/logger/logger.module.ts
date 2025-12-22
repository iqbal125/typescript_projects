import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        PinoLoggerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const nodeEnv = configService.get<string>('app.nodeEnv');
                const isProduction = nodeEnv === 'production';
                const logLevel = configService.get<string>('logger.level') || 'info';

                return {
                    pinoHttp: {
                        level: logLevel,
                        transport: !isProduction
                            ? {
                                target: 'pino-pretty',
                                options: {
                                    colorize: true,
                                    levelFirst: true,
                                    translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                                    ignore: 'pid,hostname',
                                    singleLine: false,
                                    messageFormat: '{req.headers.x-correlation-id} [{context}] {msg}',
                                },
                            }
                            : undefined,
                        customProps: (req, res) => ({
                            context: 'HTTP',
                        }),
                        serializers: {
                            req(req) {
                                return {
                                    id: req.id,
                                    method: req.method,
                                    url: req.url,
                                    // Including the headers in the log could be helpful
                                    // headers: req.headers,
                                    remoteAddress: req.remoteAddress,
                                    remotePort: req.remotePort,
                                };
                            },
                            res(res) {
                                return {
                                    statusCode: res.statusCode,
                                };
                            },
                        },
                        autoLogging: {
                            ignore: (req) => {
                                // Ignore health check endpoints from being logged
                                return req.url === '/health' || req.url === '/api/health';
                            },
                        },
                    },
                };
            },
        }),
    ],
    exports: [PinoLoggerModule],
})
export class LoggerModule { }
