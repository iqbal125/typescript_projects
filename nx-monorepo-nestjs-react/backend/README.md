# Backend

NestJS API built with SWC, Drizzle ORM (PostgreSQL), Pino logging, Helmet security, Swagger docs, and Zod validation. Part of the Nx monorepo — all commands run from the **monorepo root**.

## Quick Start

```bash
# 1. Start PostgreSQL (port 5433)
docker compose up -d db

# 2. Push database schema
pnpm nx run backend:db:push

# 3. Start the dev server (port 3000)
pnpm nx serve backend
```

## Nx Commands

| Command | Description |
|---------|-------------|
| `pnpm nx serve backend` | Start dev server with watch mode |
| `pnpm nx build backend` | Build with SWC |
| `pnpm nx lint backend` | Lint with ESLint |

## Database Commands

| Command | Description |
|---------|-------------|
| `docker compose up -d db` | Start PostgreSQL container |
| `docker compose down` | Stop containers |
| `pnpm nx run backend:db:push` | Push schema to database |
| `pnpm nx run backend:db:generate` | Generate migration from schema changes |
| `pnpm nx run backend:db:migrate` | Run pending migrations |
| `pnpm nx run backend:db:studio` | Open Drizzle Studio GUI |

## API Endpoints

Base URL: `http://localhost:3000`

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Basic ping check |
| GET | `/health/external` | External connectivity check |
| GET | `/health/db` | Database connectivity check |


### Swagger

Available at `http://localhost:3000/docs` when the server is running.

## Environment Variables

Create a `.env` file in `backend/` for local development (docker compose provides defaults for the DB):

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | `development` / `production` / `test` |
| `PORT` | `3000` | Server port |
| `HOST` | `0.0.0.0` | Server host |
| `DATABASE_URL` | — | PostgreSQL connection string (**required**) |
| `JWT_SECRET` | — | Min 32 chars |
| `JWT_EXPIRATION` | `24h` | e.g. `30s`, `5m`, `24h`, `7d` |
| `LOG_LEVEL` | `info` | `fatal` / `error` / `warn` / `info` / `debug` / `trace` |
| `CORS_ENABLED` | `true` | Enable CORS |
| `CORS_ORIGIN` | `*` | Allowed origins |

Example `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/nestapp
JWT_SECRET=change-this-to-a-secure-secret-at-least-32-characters
```

## Project Structure

```
backend/
├── src/
│   ├── main.ts                  # Bootstrap (Pino, Helmet, CORS, Swagger, Zod)
│   ├── app.module.ts            # Root module
│   ├── common/
│   │   ├── logger/              # Pino logger module
│   │   └── types/               # Shared types (ApiResponse)
│   ├── database/
│   │   ├── schema.ts            # Drizzle table definitions
│   │   ├── drizzle.module.ts    # Database module
│   │   └── drizzle.service.ts   # Connection pool + typed db instance
│   ├── global/
│   │   ├── config.ts            # Namespaced config with Joi validation
│   │   ├── security.ts          # Helmet & CORS options
│   │   └── swagger.ts           # Swagger setup
│   └── modules/
│       ├── health/              # Health check endpoints
│       └── todo/                # Todo CRUD + pagination + seed
├── drizzle/                     # SQL migrations
├── drizzle.config.ts            # Drizzle Kit config
├── bruno/                       # Bruno API test collection
├── .swcrc                       # SWC compiler config
└── nest-cli.json                # NestJS schematics config
```

## Docker (PostgreSQL)

The root `docker-compose.yml` runs PostgreSQL 17 on **port 5433** (mapped from container 5432):

- User: `postgres`
- Password: `postgres`
- Database: `nestapp`
- Connection string: `postgresql://postgres:postgres@localhost:5433/nestapp`

## Bruno API Tests

Import the `backend/bruno/` collection into [Bruno](https://www.usebruno.com/) to test all endpoints. Set the `URL` environment variable to `http://localhost:3000`.
