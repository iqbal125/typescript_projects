# Frontend

React app using Vite, Tailwind CSS v4, and shadcn/ui.

## Commands

```bash
# Development server (http://localhost:4200)
pnpm nx serve frontend

# Production build (outputs to frontend/dist)
pnpm nx build frontend

# Lint
pnpm nx lint frontend

# Type check
pnpm nx typecheck frontend

# Clear Nx local cache, workspace metadata, and restart the daemon
pnpm nx reset
```

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- shadcn/ui + Radix UI
- React Router DOM
- Redux Toolkit
- TanStack Query + Table
- React Hook Form + Zod
- Axios

## Path Aliases

`@/*` maps to `src/*` — configured in both `vite.config.mts` and `tsconfig.app.json`.

```tsx
import { Button } from "@/components/ui/button"
```

## Adding Dependencies

Install to the frontend package, not the root:

```bash
pnpm --filter @org/frontend add <package>
pnpm --filter @org/frontend add -D <package>
```
