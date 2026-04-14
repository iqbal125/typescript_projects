import { execSync } from 'node:child_process';
import { test as setup } from '@playwright/test';
import { workspaceRoot } from '@nx/devkit';
import { env } from './env';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForTestDbReady(env: NodeJS.ProcessEnv) {
  const checkCommand =
    'docker compose -f docker/docker-compose.yml -f docker/docker-compose.test.yml exec -T test_db pg_isready -U postgres';

  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      execSync(checkCommand, { cwd: workspaceRoot, stdio: 'ignore', env });
      return;
    } catch {
      await sleep(1000);
    }
  }

  throw new Error('Timed out waiting for test_db to become ready.');
}

setup('prepare test database', async () => {
  execSync('pnpm run test:db:up', { cwd: workspaceRoot, stdio: 'inherit', env });
  await waitForTestDbReady(env);
  execSync('pnpm run test:db:push', { cwd: workspaceRoot, stdio: 'inherit', env });
});
