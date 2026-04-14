import { createZodDto } from 'nestjs-zod';

import {
    CreateTodoSchema,
    UpdateTodoSchema,
    TodoIdSchema,
    ListTodosQuerySchema,
} from '@org/shared-types/todo/requests';
import {
    TodoResponseSchema,
    PaginatedTodosResponseSchema,
    DeleteTodoResponseSchema,
} from '@org/shared-types/todo/responses';

// ── Request DTOs ─────────────────────────────────────────────────────────────

export class CreateTodoDto extends createZodDto(CreateTodoSchema) { }

export class UpdateTodoDto extends createZodDto(UpdateTodoSchema) { }

export class UuidParamDto extends createZodDto(TodoIdSchema) { }

export class ListTodosQueryDto extends createZodDto(ListTodosQuerySchema) { }

// ── Response DTOs ────────────────────────────────────────────────────────────

export class TodoResponseDto extends createZodDto(TodoResponseSchema) { }

export class PaginatedTodosResponseDto extends createZodDto(PaginatedTodosResponseSchema) { }

export class DeleteTodoResponseDto extends createZodDto(DeleteTodoResponseSchema) { }


