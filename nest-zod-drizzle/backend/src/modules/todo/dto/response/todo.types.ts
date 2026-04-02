import { todos } from 'src/database/schema';

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  totalPages: number;
}

export interface PaginatedTodos {
  data: Todo[];
  meta: PaginationMeta;
}
