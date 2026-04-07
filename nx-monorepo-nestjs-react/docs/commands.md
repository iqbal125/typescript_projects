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
pnpm nx run-many -t test
pnpm nx run-many -t test-ci
```

## Lint and Typecheck

```bash
pnpm nx lint backend
pnpm nx lint frontend
pnpm nx run-many -t lint
pnpm nx run-many -t typecheck
```

## Database (Drizzle)

```bash
pnpm --filter backend db:generate
pnpm --filter backend db:migrate
pnpm --filter backend db:push
pnpm --filter backend db:studio
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

## Common Recovery Command

If you hit stale local cache/build behavior:

```bash
pnpm nx serve backend --skipNxCache
```

## Notes

- Package manager: pnpm
- Workspace tool: Nx
- Backend default URL: http://localhost:3000
- Frontend default URL: http://localhost:4200
