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

Create root `.env.local` from template:

```bash
cp .env.local.template .env.local
```

Minimum local values:

```env
NODE_ENV=development
ENV_FILE=.env.local
BACKEND_HOST=localhost
BACKEND_PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/nestapp
VITE_API_URL=http://localhost:3000
VITE_FRONTEND_HOST=localhost
VITE_FRONTEND_PORT=4200
```

`.env.local.template` includes the full backend/frontend shape. Copy all keys into `.env.local` and update as needed.

## 4) Run Database Migration

```bash
pnpm run db:migrate
```

If you are iterating rapidly in local dev and want schema sync without migration files:

```bash
pnpm run db:push
```

## 5) Start Backend and Frontend

In separate terminals:

```bash
pnpm run start:backend
```

```bash
pnpm run start:frontend
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

## One-Command E2E (Playwright)

Create root `.env.test` from template with isolated test values, then run:

```bash
cp .env.test.template .env.test
```

```env
NODE_ENV=test
ENV_FILE=.env.test
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/nestapp_test
BACKEND_HOST=localhost
BACKEND_PORT=3100
VITE_API_URL=http://localhost:3100
VITE_FRONTEND_HOST=localhost
VITE_FRONTEND_PORT=4300
```

```bash
pnpm run test:e2e
```

This single command loads `.env.test`, starts PostgreSQL, pushes schema, starts backend/frontend, and executes Playwright tests.

For full details, see:

- [environment-variables.md](environment-variables.md)
- [playwright-testing.md](playwright-testing.md)

## Next Reading

- [architecture.md](architecture.md)
- [backend.md](backend.md)
- [frontend.md](frontend.md)
- [database.md](database.md)
- [commands.md](commands.md)
