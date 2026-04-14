# Backend

NestJS API service in this Nx workspace.

## Essentials

Run from workspace root:

```bash
# Start database
docker compose -f docker/docker-compose.yml up -d db

# Start backend in dev mode
pnpm nx serve backend
```

Default API URLs:
- App: http://localhost:3000
- Swagger: http://localhost:3000/docs
- Health: http://localhost:3000/health

## Useful Backend Commands

```bash
pnpm nx build backend
pnpm nx lint backend
pnpm nx test backend
pnpm --filter backend db:migrate
```

## Detailed Docs

- Backend guide: [../docs/backend.md](../docs/backend.md)
- Database guide: [../docs/database.md](../docs/database.md)
- Full command reference: [../docs/commands.md](../docs/commands.md)
- Getting started: [../docs/getting-started.md](../docs/getting-started.md)
