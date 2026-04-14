import { defineConfig } from '@playwright/test';
import { workspaceRoot } from '@nx/devkit';

const apiBaseUrl = process.env.VITE_API_URL ?? 'http://localhost:3100';

export default defineConfig({
  testDir: './api/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: apiBaseUrl,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup db',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'api',
      dependencies: ['setup db'],
    },
  ],
  webServer: [
    {
      command: 'pnpm run test:backend',
      url: `${apiBaseUrl}/health`,
      cwd: workspaceRoot,
      timeout: 120 * 1000,
    },
  ],
});
