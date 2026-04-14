# Database Guide

This workspace uses PostgreSQL with Drizzle ORM through @org/server-db.

## Local Database Service

Start PostgreSQL container from workspace root:

```bash
docker compose -f docker/docker-compose.yml up -d db
```

Stop services:

```bash
docker compose -f docker/docker-compose.yml down
```

Default local connection values:
- Host: localhost
- Port: 5433
- User: postgres
- Password: postgres
- Database: nestapp

Playwright test database defaults:
- Host: localhost
- Port: 5434
- User: postgres
- Password: postgres
- Database: nestapp_test

Connection string example:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/nestapp
```

## Drizzle Workflows

Run from workspace root:

```bash
pnpm run db:generate
pnpm run db:migrate
pnpm run db:push
pnpm run db:studio
```

What each does:
- db:generate: creates migration files from schema changes.
- db:migrate: applies pending migrations to database.
- db:push: pushes schema directly (useful in local dev).
- db:studio: opens Drizzle Studio UI.

## Recommended Local Flow

1. Update schema/entities.
2. Run db:generate.
3. Run db:migrate.
4. Start backend and verify health/db endpoint.

Fast iteration alternative:
1. Update schema/entities.
2. Run db:push.
3. Verify through app and tests.

## Seed Data

Seed is exposed through backend API:
- POST /v1/todo/seed

Use this endpoint after backend is running to generate sample todo records.

## Troubleshooting Basics

- If backend cannot connect, confirm database container is healthy and DATABASE_URL matches port 5433.
- If schema appears stale, rerun db:migrate or db:push depending on workflow.
- If Docker command fails, verify Docker Desktop is running.

## Related Docs

- [backend.md](backend.md)
- [environment-variables.md](environment-variables.md)
- [playwright-testing.md](playwright-testing.md)
- [commands.md](commands.md)
- [getting-started.md](getting-started.md)
