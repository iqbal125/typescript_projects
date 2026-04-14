import { randomUUID } from 'node:crypto';
import { test, expect } from '@playwright/test';
import { CreateTodoSchema, type CreateTodoInput } from '@org/shared-types/todo/requests';
import {
  DeleteTodoResponseSchema,
  PaginatedTodosResponseSchema,
  TodoResponseSchema,
  type DeleteTodoDto,
  type PaginatedTodosDto,
  type TodoDto,
} from '@org/shared-types/todo/responses';

import { env } from '../../utils/env';
import { clearTestDb } from '../../utils/test-db';
import { createTodoInputMock } from '../../utils/todo-mocks';

const apiBaseUrl = env.VITE_API_URL;

test.beforeEach(async () => {
  clearTestDb();
});

test('creates a todo and verifies it in todos api', async ({ request }) => {
  const createPayload: CreateTodoInput = CreateTodoSchema.parse(
    createTodoInputMock({
      title: `API Todo ${randomUUID().slice(0, 8)}`,
      description: 'Created by Playwright API test',
    }),
  );

  const createResponse = await request.post(`${apiBaseUrl}/v1/todo`, { data: createPayload });
  expect(createResponse.status()).toBe(201);

  const createdTodo: TodoDto = TodoResponseSchema.parse(await createResponse.json());
  expect(createdTodo.title).toBe(createPayload.title);
  expect(createdTodo.description).toBe(createPayload.description ?? null);

  const listResponse = await request.get(`${apiBaseUrl}/v1/todos`, {
    params: {
      limit: 100,
      offset: 0,
    },
  });
  expect(listResponse.ok()).toBeTruthy();

  const todosResponse: PaginatedTodosDto = PaginatedTodosResponseSchema.parse(await listResponse.json());
  const createdTodoFromList = todosResponse.data.find((todo) => todo.id === createdTodo.id);

  expect(createdTodoFromList).toBeDefined();
  expect(createdTodoFromList?.title).toBe(createdTodo.title);
  expect(createdTodoFromList?.description).toBe(createdTodo.description);

  const deleteResponse = await request.delete(`${apiBaseUrl}/v1/todo/${createdTodo.id}`);
  expect(deleteResponse.ok()).toBeTruthy();

  const deleteBody: DeleteTodoDto = DeleteTodoResponseSchema.parse(await deleteResponse.json());
  expect(deleteBody.success).toBe(true);
});
