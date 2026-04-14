import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { DrizzleService } from '../../database/drizzle.service';
import { sql } from 'drizzle-orm';


@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private drizzle: DrizzleService,
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
            async (): Promise<HealthIndicatorResult> => {
                try {
                    await this.drizzle.db.execute(sql`SELECT 1`);
                    return { database: { status: 'up' } };
                } catch (e) {
                    return { database: { status: 'down' } };
                }
            },
        ]);
    }
}
