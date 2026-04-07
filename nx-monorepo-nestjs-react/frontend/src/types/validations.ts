// All Todo validation schemas and input types are now provided by @org/shared-types.
// Re-export for any remaining local consumers.
export { CreateTodoSchema as createTodoSchema, UpdateTodoSchema as updateTodoSchema } from '@org/shared-types';
export type { CreateTodoInput, UpdateTodoInput } from '@org/shared-types';
