import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from 'src/database/prisma.service';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private prismaHealth: PrismaHealthIndicator,
        private prisma: PrismaService,
    ) { }


    @Get('/')
    @HealthCheck()
    check() {
        return 'ping'
    }

    @Get('/external')
    @HealthCheck()
    checkExternal() {
        return this.health.check([
            () => this.http.pingCheck('google', 'https://google.com'),
        ]);
    }

    @Get('/db')
    @HealthCheck()
    checkDatabase() {
        return this.health.check([
            () => this.prismaHealth.pingCheck('database', this.prisma),
        ]);
    }
}
