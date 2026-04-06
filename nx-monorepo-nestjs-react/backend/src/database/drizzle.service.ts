import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@org/db';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
    private pool!: Pool;
    db!: NodePgDatabase<typeof schema>;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        this.pool = new Pool({
            connectionString: this.configService.get<string>('database.url'),
        });
        this.db = drizzle(this.pool, { schema });
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}
