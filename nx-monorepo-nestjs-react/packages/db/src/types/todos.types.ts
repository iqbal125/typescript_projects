
import { todos } from '../schema/todo'

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
