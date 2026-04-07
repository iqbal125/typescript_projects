# Backend Guide

The backend is a NestJS API app located in backend/.

## What It Provides

- Health endpoints for service/external/db checks.
- Todo endpoints with CRUD and pagination.
- Swagger API docs.
- Configured logging, security middleware, and request validation.

## Run and Build

From workspace root:

```bash
pnpm nx serve backend
pnpm nx build backend
pnpm nx lint backend
pnpm nx test backend
```

## API Entry Points

Default base URL:
- http://localhost:3000

Health:
- GET /health
- GET /health/external
- GET /health/db

Todo (versioned):
- GET /v1/todo/:id
- GET /v1/todos?limit=10&offset=0
- POST /v1/todo
- PUT /v1/todo/:id
- DELETE /v1/todo/:id
- POST /v1/todo/seed

Swagger:
- http://localhost:3000/docs

## Configuration

Common environment variables:
- NODE_ENV: environment mode.
- PORT: backend port (default 3000).
- HOST: backend host (default 0.0.0.0).
- DATABASE_URL: PostgreSQL connection string.
- JWT_SECRET: JWT signing secret.
- JWT_EXPIRATION: token lifetime.
- LOG_LEVEL: pino level.
- CORS_ENABLED and CORS_ORIGIN: CORS behavior.

Example minimum local file (backend/.env):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/nestapp
JWT_SECRET=change-this-to-a-secure-secret-at-least-32-characters
```

## Module-Level Notes

Health module:
- Intended for local checks, operational checks, and dependency checks.

Todo module:
- Implements todo CRUD, pagination response metadata, and seed behavior.

Auth module:
- Folder exists and configuration scaffolding is present.
- Feature expansion can build on existing JWT config structure.

## Bruno Collection

API requests are organized in backend/bruno/.

Typical usage:
1. Import backend/bruno in Bruno.
2. Set URL environment value to http://localhost:3000.
3. Execute health and todo requests.

## Related Docs

- [database.md](database.md)
- [commands.md](commands.md)
- [architecture.md](architecture.md)
