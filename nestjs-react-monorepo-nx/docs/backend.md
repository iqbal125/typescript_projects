# Backend Guide

The backend is a NestJS API app located in apps/backend/.

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
- BACKEND_PORT: backend port.
- BACKEND_HOST: backend host.
- DATABASE_URL: PostgreSQL connection string.
- JWT_SECRET: JWT signing secret.
- JWT_EXPIRATION: token lifetime.
- LOG_LEVEL: pino level.
- CORS_ENABLED and CORS_ORIGIN: CORS behavior.

Example minimum local values (root `.env.local`):

```env
BACKEND_HOST=localhost
BACKEND_PORT=3000
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

## Import Boundaries by Layer

Backend layers have strict rules about which packages they import from:

| Layer | Imports from | Does NOT import from |
|-------|-------------|----------------------|
| Repository | `@org/server-db` | `@org/shared-types` |
| Service | `@org/shared-types` | `@org/server-db` |
| Controller | `@org/shared-types` | `@org/server-db` |

- **Repositories** work directly with the database schema and entity types from `@org/server-db`. They are the only layer that touches the DB schema.
- **Services and controllers** use shared contracts from `@org/shared-types`. These are the same types the frontend consumes, keeping both sides aligned.
- **Do not mix** database types and shared contract types in the same layer.

### Schema Drift and TypeScript Structural Typing

TypeScript uses structural typing, which means a type with _more_ properties is assignable to a type with _fewer_ properties as long as all required properties match. This has practical implications for how DB entities and shared contracts interact:

- **What TypeScript catches:** If a DB column is removed or a new required column is added to the entity, the service layer will produce a compile error because the entity no longer satisfies the shared contract type.
- **What TypeScript does NOT catch:** If a new optional column is added to the DB schema, the entity silently gains that field. The service return type (`TodoDto`) still compiles because the entity is a structural superset. The extra field would leak into the API response at runtime.

### Runtime Protection via ZodSerializerDto

The `@ZodSerializerDto` decorator on controller methods solves the runtime leak problem. It runs the response through the Zod schema before serialization, stripping any fields not defined in the shared contract. This means:

- Extra DB columns never reach the API consumer, even if TypeScript doesn't flag them.
- The shared contract in `@org/shared-types` remains the single source of truth for API shape.
- Every controller endpoint returning entity data **must** use `@ZodSerializerDto` to maintain this guarantee.

## Bruno Collection

API requests are organized in apps/backend/bruno/.

Typical usage:
1. Import apps/backend/bruno in Bruno.
2. Set URL environment value to http://localhost:3000.
3. Execute health and todo requests.

## Related Docs

- [database.md](database.md)
- [environment-variables.md](environment-variables.md)
- [playwright-testing.md](playwright-testing.md)
- [commands.md](commands.md)
- [architecture.md](architecture.md)




