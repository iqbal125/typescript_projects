import { z } from 'zod';

export const createTodoSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().max(300, 'Description must be at most 300 characters').optional(),
});

export const updateTodoSchema = createTodoSchema.partial();

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
