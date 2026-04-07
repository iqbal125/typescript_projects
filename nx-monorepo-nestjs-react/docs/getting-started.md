# Getting Started

This guide helps you run the full stack locally (PostgreSQL, backend, frontend).

## Prerequisites

- Node.js 22+
- pnpm
- Docker

## 1) Install Dependencies

From workspace root:

```bash
pnpm install
```

## 2) Start Database

```bash
docker compose -f docker/docker-compose.yml up -d db
```

Database defaults used by local setup:
- Host: localhost
- Port: 5433
- User: postgres
- Password: postgres
- Database: nestapp

## 3) Configure Environment

Create backend env file at backend/.env.

Minimum local values:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/nestapp
JWT_SECRET=change-this-to-a-secure-secret-at-least-32-characters
```

Optional values:

```env
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
CORS_ENABLED=true
CORS_ORIGIN=*
JWT_EXPIRATION=24h
LOG_LEVEL=info
```

## 4) Run Database Migration

```bash
pnpm --filter backend db:migrate
```

If you are iterating rapidly in local dev and want schema sync without migration files:

```bash
pnpm --filter backend db:push
```

## 5) Start Backend and Frontend

In separate terminals:

```bash
pnpm nx serve backend
```

```bash
pnpm nx serve frontend
```

## 6) Verify the Setup

Backend checks:
- API base: http://localhost:3000
- Swagger: http://localhost:3000/docs
- Health: http://localhost:3000/health

Frontend check:
- App: http://localhost:4200

## Common First-Day Commands

```bash
# Build all
pnpm nx run-many -t build

# Run tests
pnpm nx run-many -t test

# Lint all
pnpm nx run-many -t lint

# Typecheck all
pnpm nx run-many -t typecheck
```

## Next Reading

- [architecture.md](architecture.md)
- [backend.md](backend.md)
- [frontend.md](frontend.md)
- [database.md](database.md)
- [commands.md](commands.md)
