import { Injectable, Logger } from '@nestjs/common';
import { count, eq } from 'drizzle-orm';
import { seed } from 'drizzle-seed';
import { DrizzleService } from '../../database/drizzle.service';
import { todos } from '@org/server-db';
import { NewTodoEntity, TodoEntity } from '@org/server-db';

@Injectable()
export class TodoRepository {
    private readonly logger = new Logger(TodoRepository.name);

    constructor(private drizzle: DrizzleService) { }

    async findById(id: string): Promise<TodoEntity | undefined> {
        const result = await this.drizzle.db
            .select()
            .from(todos)
            .where(eq(todos.id, id))
            .limit(1);
        return result[0];
    }

    async findMany(limit: number, offset: number): Promise<TodoEntity[]> {
        return this.drizzle.db.select().from(todos).limit(limit).offset(offset);
    }

    async countAll(): Promise<number> {
        const result = await this.drizzle.db.select({ total: count() }).from(todos);
        return result[0].total;
    }

    async create(data: NewTodoEntity): Promise<TodoEntity> {
        try {
            const result = await this.drizzle.db.insert(todos).values(data).returning();
            return result[0];
        } catch (error) {
            this.logger.error(
                `Failed to create todo with title "${data.title}"`,
                error instanceof Error ? error.stack : undefined,
            );
            throw error;
        }
    }

    async update(id: string, data: NewTodoEntity): Promise<TodoEntity> {
        try {
            const result = await this.drizzle.db
                .update(todos)
                .set({ ...data, updatedAt: new Date().toISOString() })
                .where(eq(todos.id, id))
                .returning();
            return result[0];
        } catch (error) {
            this.logger.error(
                `Failed to update todo ${id}`,
                error instanceof Error ? error.stack : undefined,
            );
            throw error;
        }
    }

    async delete(id: string): Promise<null> {
        try {
            await this.drizzle.db
                .delete(todos)
                .where(eq(todos.id, id));
            return null;
        } catch (error) {
            this.logger.error(
                `Failed to delete todo ${id}`,
                error instanceof Error ? error.stack : undefined,
            );
            throw error;
        }
    }

    async seed(): Promise<TodoEntity[]> {
        await this.drizzle.db.delete(todos);
        const titles = [
            'Buy groceries', 'Read a book', 'Exercise', 'Call mom',
            'Fix bug in project', 'Write unit tests', 'Plan weekend trip',
            'Clean the house', 'Pay bills', 'Learn TypeScript generics',
            'Cook dinner', 'Organize desk', 'Review pull requests',
            'Update resume', 'Meditate', 'Watch tutorial', 'Water plants',
            'Schedule dentist appointment', 'Backup files', 'Refactor auth module',
            'Prepare presentation', 'Send invoices', 'Read documentation',
            'Stretch routine', 'Reply to emails', 'Pick up dry cleaning',
            'Set up CI/CD pipeline', 'Review monthly budget', 'Install system updates',
            'Write blog post', 'Take out trash', 'Feed the cat',
            'Order new headphones', 'Fix broken link', 'Renew library membership',
            'Complete online course', 'Grocery meal prep', 'Submit expense report',
            'Charge devices', 'Redesign landing page', 'Fix linting errors',
            'Set up local database', 'Attend team standup', 'Read industry news',
            'Archive old projects', 'Print documents', 'Test API endpoints',
            'Update dependencies', 'Write changelog', 'Deploy to production',
        ];
        await seed(this.drizzle.db, { todos }).refine((f) => ({
            todos: {
                count: 50,
                columns: {
                    title: f.valuesFromArray({ values: titles }),
                    description: f.loremIpsum({ sentencesCount: 1 }),
                },
            },
        }));
        return this.drizzle.db.select().from(todos);
    }
}
