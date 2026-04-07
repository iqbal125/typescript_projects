# Architecture

This workspace uses Nx + pnpm workspaces to manage backend, frontend, and shared packages.

## High-Level Structure

- backend/: NestJS API service.
- frontend/: React + Vite web app.
- packages/db/: Drizzle ORM schema and DB tooling.
- packages/shared-types/: Shared contracts (types/schemas/DTOs).
- packages/utils/: Shared utility functions.

## Project Responsibilities

Backend:
- Exposes REST API endpoints.
- Owns domain/service logic for todo operations.
- Connects to PostgreSQL via Drizzle.
- Provides Swagger docs and health endpoints.

Frontend:
- Provides UI routes and interactions.
- Calls backend API through Axios client layer.
- Uses shared contracts to keep request/response typing aligned.

Shared packages:
- @org/db: Database schema, entities, and migration tooling.
- @org/shared-types: Reusable DTO and validation contracts.
- @org/utils: Generic utility helpers.

## Dependency Flow

Typical dependency direction:

- frontend -> @org/shared-types
- frontend -> @org/utils
- backend -> @org/db
- backend -> @org/shared-types
- backend -> @org/utils

Design intent:
- Apps depend on shared packages.
- Shared packages do not depend on app code.

## Runtime Flow

Local runtime:
1. PostgreSQL container starts from docker/docker-compose.yml.
2. Backend starts on port 3000 and connects using DATABASE_URL.
3. Frontend starts on port 4200 and sends API requests to backend.

## Backend Module Overview

Current backend modules include:
- health: /health, /health/external, /health/db
- todo: create/read/update/delete, pagination, seed endpoint
- auth: scaffolded module path exists; implementation is minimal

## Contract Strategy

Contracts are centralized in @org/shared-types to avoid mismatch between backend output and frontend usage.

Benefits:
- Single source of truth for DTOs and validation schema contracts.
- Better type safety across package boundaries.
- Lower risk of drift during feature changes.

## Nx Notes

Useful architecture visibility commands:

```bash
pnpm nx graph
pnpm nx show projects
pnpm nx show project backend --json
pnpm nx show project frontend --json
```

## Related Docs

- [getting-started.md](getting-started.md)
- [backend.md](backend.md)
- [frontend.md](frontend.md)
- [database.md](database.md)
- [commands.md](commands.md)
