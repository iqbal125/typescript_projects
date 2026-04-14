# Environment Variables

This guide explains how environment variables are organized across local development, backend runtime, frontend runtime, database tooling, and Playwright test runs.

## Environment Files in This Workspace

Primary root-level files:

- `.env.local`: local development defaults.
- `.env.test`: isolated test defaults used by Playwright orchestration.

Templates:

- `.env.local.template` (matches `.env.local`)
- `.env.test.template` (matches `.env.test`)

Git behavior:

- `.env.local` and `.env.test` are ignored by git.
- template files are committed so the team can share expected variable shape.

## Recommended Setup

1. Copy `.env.local.template` to `.env.local`.
2. Update values for your machine (ports, database host, secrets).
3. Copy `.env.test.template` to `.env.test` for isolated e2e/api test runs.
4. Keep production/staging secrets outside this repo and inject them at runtime.

## Variable Reference

### App Runtime

- `NODE_ENV`: app mode (`development`, `test`, `production`, `staging`).
- `APP_NAME`, `APP_VERSION`: metadata shown in backend config and docs.
- `LOG_LEVEL`: logger level (`fatal`, `error`, `warn`, `info`, `debug`, `trace`).

### Backend Server

- `BACKEND_HOST`: backend bind host.
- `BACKEND_PORT`: backend bind port.
- `ENV_FILE`: env file path used by backend config module (defaults to `.env.local` when unset).

### Database

- `DATABASE_URL`: full PostgreSQL connection string.

### Security and API Docs

- `JWT_SECRET`: JWT signing secret (minimum 32 chars recommended).
- `JWT_EXPIRATION`: duration format like `30s`, `5m`, `24h`, `7d`.
- `CORS_ENABLED`, `CORS_ORIGIN`: CORS controls.
- `SWAGGER_TITLE`, `SWAGGER_DESCRIPTION`, `SWAGGER_VERSION`: OpenAPI metadata.

### Frontend

- `VITE_FRONTEND_HOST`, `VITE_FRONTEND_PORT`: Vite dev/preview server binding.
- `VITE_API_URL`: backend base URL used by frontend API client (must be a valid URL).

## How Each System Reads Env

Backend (`apps/backend`):

- Uses Nest `ConfigModule`.
- Reads file path from `ENV_FILE` or falls back to `.env.local`.
- Reuses shared backend env schema from `packages/server/config`.
- Validates required variables through a Zod schema at startup.

Frontend (`apps/frontend/vite.config.mts`):

- Loads env from workspace root (`envDir` points to root).
- Validates `VITE_FRONTEND_HOST`, `VITE_FRONTEND_PORT`, and `VITE_API_URL` at Vite startup.
- Uses `VITE_FRONTEND_HOST` and `VITE_FRONTEND_PORT` for dev server config.
- Uses `VITE_*` variables for browser-exposed runtime config.
- Reuses shared frontend env schemas from `packages/frontend/config`.
- Validates browser env values through a Zod schema in `apps/frontend/src/lib/env.ts`.
- Fails fast at app startup with a clear error if required `VITE_*` values are missing or invalid.

Database tooling (`packages/server/db/drizzle.config.ts`):

- Uses `dotenv/config`.
- Requires `DATABASE_URL`.

Playwright (`apps/playwright/playwright.config.ts`):

- Uses `process.env` values passed by root scripts (for example `pnpm run test:e2e` uses `env-cmd -f .env.test`).
- Uses backend/frontend host and port variables to build test URLs.

## Common Config Profiles

Local development profile (`.env.local`):

- Backend: `localhost:3000`
- Frontend: `localhost:4200`
- DB: `localhost:5433` / `nestapp`

Test profile (`.env.test`):

- Backend: `localhost:3100`
- Frontend: `localhost:4300` (or your chosen test port)
- DB: `localhost:5434` / `nestapp_test`

## Troubleshooting

- Backend fails at startup: confirm `BACKEND_HOST` and `BACKEND_PORT` are present and valid.
- DB connection errors: verify `DATABASE_URL` points to the running postgres instance.
- Frontend hitting wrong API: check `VITE_API_URL` and restart `frontend:serve`.
- E2E using wrong ports: verify `.env.test` values and rerun `pnpm run test:e2e`.

## Related Docs

- [playwright-testing.md](playwright-testing.md)
- [getting-started.md](getting-started.md)
- [backend.md](backend.md)
- [database.md](database.md)
