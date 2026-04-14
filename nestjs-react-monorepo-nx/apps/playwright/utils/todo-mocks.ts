import type { CreateTodoInput } from '@org/shared-types/todo/requests';
import type { PaginatedTodosDto, TodoDto } from '@org/shared-types/todo/responses';

const MOCK_TODO_CREATED_AT = '2026-04-12T10:00:00.000Z';

export const createTodoInputMock = (overrides: Partial<CreateTodoInput> = {}): CreateTodoInput => ({
  title: 'Buy groceries',
  description: 'Milk, eggs, and bread',
  ...overrides,
});

export const createTodoMock = (createPayload: CreateTodoInput, overrides: Partial<TodoDto> = {}): TodoDto => ({
  id: 'todo-1',
  title: createPayload.title,
  description: createPayload.description ?? null,
  createdAt: MOCK_TODO_CREATED_AT,
  updatedAt: MOCK_TODO_CREATED_AT,
  ...overrides,
});

export const createPaginatedTodosMock = (
  todos: TodoDto[],
  overrides: Partial<PaginatedTodosDto['meta']> = {},
): PaginatedTodosDto => ({
  data: todos,
  meta: {
    total: todos.length,
    limit: 10,
    offset: 0,
    totalPages: 1,
    ...overrides,
  },
});
