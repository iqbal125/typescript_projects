import { z } from 'zod';

// ── Request schemas ──────────────────────────────────────────────────────────

export const CreateTodoSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().max(300, 'Description must be at most 300 characters').optional(),
});

export const UpdateTodoSchema = CreateTodoSchema.partial({ description: true });

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;

// ── Response types ───────────────────────────────────────────────────────────

export interface TodoDto {
    id: string;
    title: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationMeta {
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
}

export interface PaginatedTodosDto {
    data: TodoDto[];
    meta: PaginationMeta;
}

export interface DeleteTodoDto {
    success: boolean;
}
