import { randomUUID } from 'node:crypto';
import { test, expect } from '@playwright/test';
import type { CreateTodoInput } from '@org/shared-types/todo/requests';
import { clearTestDb } from '../../utils/test-db';

test.beforeEach(async () => {
  clearTestDb();
});

test('creates todo through full frontend flow', async ({ page }) => {
  const createPayload: CreateTodoInput = {
    title: `E2E Todo ${randomUUID().slice(0, 8)}`,
    description: 'Created through frontend and verified in todos table',
  };

  await page.goto('/todos');
  await page.getByPlaceholder('Todo title...').fill(createPayload.title);
  await page.getByPlaceholder('Optional description...').fill(createPayload.description ?? '');
  await page.getByRole('button', { name: 'Add Todo' }).click();

  await page.goto('/todos-table');
  await expect(page.getByRole('cell', { name: createPayload.title })).toBeVisible();
  await expect(page.getByRole('cell', { name: createPayload.description ?? '' })).toBeVisible();
});
