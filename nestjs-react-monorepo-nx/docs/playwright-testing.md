# Playwright Testing

This guide explains how Playwright is wired into the Nx workspace, how tests are orchestrated, and how to extend the suite safely.

## Scope

The Playwright project validates three layers of behavior:

- end-to-end browser flow against real backend + database
- API contract behavior using Playwright request context
- frontend behavior with mocked network responses

Project root:

- `apps/playwright`

## Environment and URL Configuration

Playwright runs against root `.env.test`:

- root script `pnpm run test:e2e` loads `.env.test` via `env-cmd -f .env.test`
- `baseURL` is built from `VITE_FRONTEND_HOST` and `VITE_FRONTEND_PORT`
- URLs are built in `apps/playwright/utils/env.ts` from `BACKEND_HOST`/`BACKEND_PORT` and `VITE_FRONTEND_HOST`/`VITE_FRONTEND_PORT`

For complete env variable reference and file strategy, see [environment-variables.md](environment-variables.md).

## Nx Targets

Common Playwright targets:

- `pnpm run test:e2e`: run Playwright with `.env.test`
- `pnpm run test:e2e:ci`: run CI variant with `.env.test`
- `pnpm nx run playwright:test`: direct Nx target (requires env to already be set)

## Execution Pipeline

When `playwright:e2e` runs, the flow is:

1. Root script injects `.env.test` into process environment.
2. Run setup project `setup db` (`global.setup.ts`).
3. Start test database container (`db:up:test`), wait for readiness, push schema (`db:push`).
4. Start backend and frontend servers via Nx webServer commands.
5. Execute browser/API/web test files.

## Database Setup and Isolation

Setup project:

- `apps/playwright/tests/global.setup.ts`
- starts `test_db` container
- waits until `pg_isready` succeeds
- applies schema with `pnpm run db:push`

Per-test cleanup:

- `apps/playwright/tests/utils/test-db.ts`
- `clearTestDb()` truncates `todos` and resets identity counters
- called in `beforeEach` by current suites

This keeps tests deterministic and independent.

## Current Test Suites

- `tests/todo/todo.e2e.spec.ts`: full browser flow creating a todo and verifying table output.
- `tests/todo/todo.api.spec.ts`: backend API create/list/delete flow with shared Zod schemas.
- `tests/todo/todo.web.spec.ts`: frontend behavior with mocked `POST /v1/todo` and `GET /v1/todos`.

## Artifacts and Reports

Playwright outputs under:

- `apps/playwright/test-results`
- `apps/playwright/playwright-report`

Config also enables:

- HTML reporter
- trace collection on first retry

## Adding New Tests

Recommended workflow:

1. Choose test style:
   - e2e for real end-user flow across frontend/backend/db
   - api for backend contract checks without browser UI
   - web for frontend-only behavior with mocks
2. Reuse shared request/response schemas from `@org/shared-types`.
3. Keep database state isolated by calling `clearTestDb()` in `beforeEach` when tests mutate data.
4. Place files in `apps/playwright/tests` and keep naming consistent: `*.spec.ts`.

## Troubleshooting

- `Timeout waiting for test_db`: confirm Docker is running and rerun `pnpm run db:up:test`.
- `Backend health never becomes ready`: verify `BACKEND_HOST` and `BACKEND_PORT` in `.env.test`.
- `Frontend URL mismatch`: verify `VITE_FRONTEND_HOST` and `VITE_FRONTEND_PORT`.
- `Unexpected stale data`: ensure `clearTestDb()` runs in each mutating suite.
- `Wrong API target in tests`: verify `VITE_API_URL` and `apiBaseUrl` config values.

## Related Docs

- [environment-variables.md](environment-variables.md)
- [commands.md](commands.md)
- [getting-started.md](getting-started.md)
