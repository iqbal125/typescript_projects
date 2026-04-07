import { todos } from '../schema/todo'

export type TodoEntity = typeof todos.$inferSelect;
export type NewTodoEntity = typeof todos.$inferInsert;
