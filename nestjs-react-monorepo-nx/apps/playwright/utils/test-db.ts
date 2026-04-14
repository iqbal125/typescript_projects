import { execFileSync } from 'node:child_process';
import { workspaceRoot } from '@nx/devkit';
import { env } from './env';

export function clearTestDb() {

  execFileSync(
    'docker',
    [
      'compose',
      '-f',
      'docker/docker-compose.yml',
      '-f',
      'docker/docker-compose.test.yml',
      'exec',
      '-T',
      'test_db',
      'psql',
      '-U',
      'postgres',
      '-d',
      'nestapp_test',
      '-c',
      'TRUNCATE TABLE todos RESTART IDENTITY CASCADE;',
    ],
    { cwd: workspaceRoot, stdio: 'inherit', env },
  );
}
