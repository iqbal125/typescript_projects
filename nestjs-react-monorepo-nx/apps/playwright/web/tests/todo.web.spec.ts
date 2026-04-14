import { test, expect } from '@playwright/test';
import type { CreateTodoInput } from '@org/shared-types/todo/requests';

import { createPaginatedTodosMock, createTodoInputMock, createTodoMock } from '../../utils/todo-mocks';

test('creates a todo and verifies it in todos table with mocked requests', async ({ page }) => {
  const mockCreatePayload: CreateTodoInput = createTodoInputMock();
  const mockTodo = createTodoMock(mockCreatePayload);
  const mockTodosResponse = createPaginatedTodosMock([mockTodo]);

  await page.route('**/v1/todo', async (route, request) => {
    if (request.method() !== 'POST') {
      await route.continue();
      return;
    }

    const payload = request.postDataJSON() as CreateTodoInput;
    expect(payload.title).toBe(mockCreatePayload.title);
    expect(payload.description).toBe(mockCreatePayload.description);

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify(mockTodo),
    });
  });

  await page.route('**/v1/todos**', async (route, request) => {
    if (request.method() !== 'GET') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockTodosResponse),
    });
  });

  await page.goto('/todos');
  await page.getByPlaceholder('Todo title...').fill(mockCreatePayload.title);
  await page.getByPlaceholder('Optional description...').fill(mockCreatePayload.description ?? '');
  await page.getByRole('button', { name: 'Add Todo' }).click();

  await page.goto('/todos-table');
  await expect(page.getByRole('cell', { name: mockTodo.title })).toBeVisible();
  await expect(page.getByRole('cell', { name: mockTodo.description ?? '' })).toBeVisible();
});
