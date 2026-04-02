import { todos } from 'src/database/schema';

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
