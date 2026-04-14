import { z } from 'zod';

// ── Base Entity Schema ───────────────────────────────────────────────────────

export const TodoBaseSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
    description: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type TodoBase = z.infer<typeof TodoBaseSchema>;

// ── Response Schemas ─────────────────────────────────────────────────────────

export const TodoResponseSchema = TodoBaseSchema;

export const PaginationMetaSchema = z.object({
    total: z.number().int(),
    limit: z.number().int(),
    offset: z.number().int(),
    totalPages: z.number().int(),
});

export const PaginatedTodosResponseSchema = z.object({
    data: z.array(TodoResponseSchema),
    meta: PaginationMetaSchema,
});

export const DeleteTodoResponseSchema = z.object({
    success: z.boolean(),
});


// ── Response types ─────────────────────────────────────────────────────────
export type TodoDto = z.infer<typeof TodoResponseSchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
export type PaginatedTodosDto = z.infer<typeof PaginatedTodosResponseSchema>;
export type DeleteTodoDto = z.infer<typeof DeleteTodoResponseSchema>;
