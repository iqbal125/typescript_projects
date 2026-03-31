import { createZodDto } from 'nestjs-zod';
import { todos } from 'src/database/schema';
import { z } from 'zod';

export const CreateTodoSchema = z.object({
  title: z.string().min(3),
  description: z.string().max(300).optional(),
});

export class CreateTodoDto extends createZodDto(CreateTodoSchema) { }

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;