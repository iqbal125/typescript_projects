import { Injectable } from '@nestjs/common';
import { count, eq } from 'drizzle-orm';
import { seed } from 'drizzle-seed';
import { DrizzleService } from '../../database/drizzle.service';
import { todos } from '../../database/schema';
import { PaginatedTodos, Todo } from './dto/response/todo.types';
import { CreateTodoDto } from './dto/request/create-todo.dto';
import { UpdateTodoDto } from './dto/request/update-todo.dto';

@Injectable()
export class TodoRepository {
    constructor(private drizzle: DrizzleService) { }

    async findById(id: number): Promise<Todo | undefined> {
        const result = await this.drizzle.db
            .select()
            .from(todos)
            .where(eq(todos.id, id))
            .limit(1);
        return result[0];
    }

    async findAll(limit: number, offset: number): Promise<PaginatedTodos> {
        const [{ total }, data] = await Promise.all([
            this.drizzle.db.select({ total: count() }).from(todos).then(r => r[0]),
            this.drizzle.db.select().from(todos).limit(limit).offset(offset),
        ]);
        return {
            data,
            meta: {
                total,
                limit,
                offset,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async create(data: CreateTodoDto): Promise<Todo> {
        const result = await this.drizzle.db.insert(todos).values(data).returning();
        return result[0];
    }

    async update(id: number, data: UpdateTodoDto): Promise<Todo | undefined> {
        const result = await this.drizzle.db
            .update(todos)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(todos.id, id))
            .returning();
        return result[0];
    }

    async delete(id: number): Promise<Todo | undefined> {
        const result = await this.drizzle.db
            .delete(todos)
            .where(eq(todos.id, id))
            .returning();
        return result[0];
    }

    async seed(): Promise<Todo[]> {
        await this.drizzle.db.delete(todos);
        await seed(this.drizzle.db, { todos }).refine((f) => ({
            todos: {
                count: 50,
                columns: {
                    title: f.valuesFromArray({
                        values: [
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
                        ],
                    }),
                    description: f.loremIpsum({ sentencesCount: 1 }),
                },
            },
        }));
        return this.drizzle.db.select().from(todos);
    }
}
