import { defineConfig, devices } from '@playwright/test';
import { workspaceRoot } from '@nx/devkit';

const apiBaseUrl = process.env.VITE_API_URL ?? 'http://localhost:3100';
const frontendHost = process.env.VITE_FRONTEND_HOST ?? 'localhost';
const frontendPort = process.env.VITE_FRONTEND_PORT ?? '4200';
const baseURL = `http://${frontendHost}:${frontendPort}`;

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup db'],
    },
    {
      name: 'setup db',
      testMatch: /global\.setup\.ts/,
    },
  ],
  webServer: [
    {
      command: 'pnpm run test:backend',
      url: `${apiBaseUrl}/health`,
      cwd: workspaceRoot,
      timeout: 120 * 1000,
    },
    {
      command: 'pnpm run test:frontend',
      url: baseURL,
      cwd: workspaceRoot,
      timeout: 120 * 1000,
    },
  ],
});
