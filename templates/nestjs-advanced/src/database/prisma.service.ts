import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(configService: ConfigService) {
        const adapter = new PrismaPg({
            connectionString: configService.get<string>('database.url') as string,
        });
        super({ adapter });
    }
}
