import { todos } from '@org/db';

// DB entity types — used in repository / data-access layer
export type TodoEntity = typeof todos.$inferSelect;
export type NewTodoEntity = typeof todos.$inferInsert;

// Re-export API-facing types from the shared contracts package
export type { TodoDto as Todo, PaginatedTodosDto as PaginatedTodos, PaginationMeta } from '@org/shared-types';
