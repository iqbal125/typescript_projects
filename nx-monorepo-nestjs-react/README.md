# Nx Monorepo — NestJS + React

An Nx monorepo with a **NestJS** backend and a **React** (Vite) frontend.

| Project     | Path        | Description              |
| ----------- | ----------- | ------------------------ |
| `backend`   | `backend/`  | NestJS API (Webpack/SWC) |
| `frontend`  | `frontend/` | React SPA (Vite)         |

## Prerequisites

- Node.js >= 22
- pnpm
- Docker (for PostgreSQL)

## Getting Started

```sh
# 1. Install dependencies
pnpm install

# 2. Start the database
docker compose up -d db

# 3. Run database migrations
pnpm --filter backend db:migrate

# 4. Start backend & frontend
pnpm nx serve backend
pnpm nx serve frontend
```

## Workspace Commands

### Serve

```sh
pnpm nx serve backend          # Start NestJS in dev mode
pnpm nx serve frontend         # Start React Vite dev server
```

### Build

```sh
pnpm nx build backend          # Build backend (SWC)
pnpm nx build frontend         # Build frontend (Vite)
pnpm nx run-many -t build      # Build all projects
```

### Test

```sh
pnpm nx test backend           # Run backend tests (Jest)
pnpm nx test frontend          # Run frontend tests (Vitest)
pnpm nx run-many -t test       # Test all projects
```

### Lint & Typecheck

```sh
pnpm nx lint backend
pnpm nx lint frontend
pnpm nx run-many -t lint       # Lint all projects
pnpm nx run-many -t typecheck  # Typecheck all projects
```

### Database (Drizzle)

Run from the workspace root — these scripts are defined in `backend/package.json`:

```sh
pnpm --filter backend db:generate   # Generate migration from schema changes
pnpm --filter backend db:migrate    # Apply pending migrations
pnpm --filter backend db:push       # Push schema directly (dev only)
pnpm --filter backend db:studio     # Open Drizzle Studio GUI
```

### Docker

```sh
docker compose up -d db        # Start PostgreSQL
docker compose down            # Stop all services
```

### Nx Utilities

```sh
pnpm nx graph                  # Visualize project dependency graph
pnpm nx show projects          # List all workspace projects
pnpm nx show project backend --json   # Show resolved config for a project
pnpm nx run-many -t lint test build   # Run multiple targets across projects
pnpm nx affected -t test       # Only test projects affected by recent changes
pnpm nx sync                   # Sync TypeScript project references
pnpm nx reset                  # Clear Nx cache and restart daemon
```

> **Stale build / MODULE_NOT_FOUND errors:** If the backend fails to start with a `Cannot find module '...dist/main'` error, the Nx build cache is stale. Fix it with:
> ```sh
> pnpm nx serve backend --skipNxCache
> ```
