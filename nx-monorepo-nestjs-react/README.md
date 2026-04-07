# Nx Monorepo - NestJS + React

Nx monorepo with a NestJS backend API, a React frontend app, and shared workspace packages.

## Projects

| Project | Path | Purpose |
| --- | --- | --- |
| backend | backend/ | NestJS API (todo + health endpoints) |
| frontend | frontend/ | React app (Vite) |
| @org/db | packages/db/ | Drizzle ORM schema and database tooling |
| @org/shared-types | packages/shared-types/ | Shared contracts and validation schemas |
| @org/utils | packages/utils/ | Shared utility helpers |

## Quick Start

Prerequisites:
- Node.js 22+
- pnpm
- Docker

```bash
# Install dependencies
pnpm install

# Start PostgreSQL
docker compose -f docker/docker-compose.yml up -d db

# Apply migrations
pnpm --filter backend db:migrate

# Run apps
pnpm nx serve backend
pnpm nx serve frontend
```

## Most Used Commands

```bash
# Development
pnpm nx serve backend
pnpm nx serve frontend

# Quality
pnpm nx run-many -t lint
pnpm nx run-many -t test
pnpm nx run-many -t typecheck

# Build
pnpm nx run-many -t build
```

## Documentation

Detailed documentation is in docs/.

- Docs index: [docs/README.md](docs/README.md)
- Getting started: [docs/getting-started.md](docs/getting-started.md)
- Architecture: [docs/architecture.md](docs/architecture.md)
- Backend guide: [docs/backend.md](docs/backend.md)
- Frontend guide: [docs/frontend.md](docs/frontend.md)
- Database guide: [docs/database.md](docs/database.md)
- Command reference: [docs/commands.md](docs/commands.md)

## Minimal Project READMEs

- Backend quick reference: [backend/README.md](backend/README.md)
- Frontend quick reference: [frontend/README.md](frontend/README.md)
- Shared packages: [packages/db/README.md](packages/db/README.md), [packages/shared-types/README.md](packages/shared-types/README.md), [packages/utils/README.md](packages/utils/README.md)
