# Frontend Guide

The frontend is a React + Vite app located in frontend/.

## What It Provides

- Client UI for todo workflows.
- Route-based pages for home/create/table experiences.
- API integration layer for backend communication.
- Shared contract usage through workspace packages.

## Run and Build

From workspace root:

```bash
pnpm nx serve frontend
pnpm nx build frontend
pnpm nx lint frontend
pnpm nx test frontend
pnpm nx typecheck frontend
```

Default local URL:
- http://localhost:4200

## Routing

Current route mapping:
- / -> Home page
- /todos -> create todo page
- /todos-table -> table/list page

## API Integration

API client is configured in frontend/src/api/.

Typical setup:
- Axios base client uses VITE_API_BASE_URL.
- Default backend URL is http://localhost:3000.

When backend runs on a different host/port, set this environment variable for frontend runtime.

## Shared Contracts and Utilities

Frontend depends on:
- @org/shared-types for cross-service contracts.
- @org/utils for shared helper functions.

This pattern keeps frontend DTO expectations aligned with backend output.

## UI and Styling

Stack includes:
- React 19
- Vite 8
- Tailwind CSS
- shadcn/ui and Radix UI primitives
- React Hook Form + Zod
- TanStack Query / Table

## Add Frontend Dependencies

Install frontend-only dependency from workspace root:

```bash
pnpm --filter @org/frontend add <package>
pnpm --filter @org/frontend add -D <package>
```

## Related Docs

- [getting-started.md](getting-started.md)
- [commands.md](commands.md)
- [architecture.md](architecture.md)
