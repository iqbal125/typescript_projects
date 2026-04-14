import { z } from 'zod';

// ── Request Schemas ─────────────────────────────────────────────────────────
export const CreateTodoSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().max(300, 'Description must be at most 300 characters').optional(),
});

export const UpdateTodoSchema = CreateTodoSchema.partial({ description: true });

export const TodoIdSchema = z.object({ id: z.uuid() });

export const ListTodosQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(10),
    offset: z.coerce.number().int().min(0).default(0),
});

// ── Request types ─────────────────────────────────────────────────────────
export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;
export type TodoId = z.infer<typeof TodoIdSchema>;
export type ListTodosQuery = z.infer<typeof ListTodosQuerySchema>;
