# Command Reference

Authoritative commands for this workspace.

All commands are executed from workspace root unless stated otherwise.

## Setup

```bash
pnpm install
docker compose -f docker/docker-compose.yml up -d db
pnpm --filter backend db:migrate
```

## Development

```bash
pnpm nx serve backend
pnpm nx serve frontend
```

## Build

```bash
pnpm nx build backend
pnpm nx build frontend
pnpm nx run-many -t build
```

## Testing

```bash
pnpm nx test backend
pnpm nx test frontend
pnpm nx run playwright:e2e
pnpm nx run playwright:e2e-ci
pnpm nx run playwright:test
pnpm nx run-many -t test
pnpm nx run-many -t test-ci
```

`pnpm nx run playwright:e2e` loads root `.env.test`, boots PostgreSQL, pushes schema, starts backend/frontend, then runs Playwright.

## Environment and Templates

```bash
cp .env.local.template .env.local
cp .env.test.template .env.test
```

Use `.env.local` for day-to-day app development and `.env.test` for Playwright orchestration.

## Lint and Typecheck

```bash
pnpm nx lint backend
pnpm nx lint frontend
pnpm nx run-many -t lint
pnpm nx run-many -t typecheck
```

## Database (Drizzle)

```bash
pnpm run db:generate
pnpm run db:migrate
pnpm run db:push
pnpm run db:studio
```

## Docker

```bash
docker compose -f docker/docker-compose.yml up -d db
docker compose -f docker/docker-compose.yml down
```

## Nx Workspace Utilities

```bash
pnpm nx graph
pnpm nx show projects
pnpm nx show project backend --json
pnpm nx show project frontend --json
pnpm nx affected -t test
pnpm nx sync
pnpm nx reset
```

## Package Management

See [package-management.md](package-management.md) for dependency add/remove commands, workspace directory registration via `pnpm-workspace.yaml`, and the internal package rename workflow.

## Common Recovery Command

If you hit stale local cache/build behavior:

```bash
pnpm nx serve backend --skipNxCache

pnpm nx reset
```

## Notes

- Package manager: pnpm
- Workspace tool: Nx
- Backend default URL: http://localhost:3000
- Frontend default URL: http://localhost:4200

## Related Docs

- [environment-variables.md](environment-variables.md)
- [playwright-testing.md](playwright-testing.md)
