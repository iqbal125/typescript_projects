# @org/shared-types

Shared contracts package for DTOs, types, and validation schemas used by frontend and backend.

## Purpose

- Keep API contracts consistent across services.
- Reuse validation and inferred TypeScript types.
- Reduce drift between backend responses and frontend expectations.

## Essentials

Run from workspace root:

```bash
pnpm nx build shared-types
pnpm nx typecheck shared-types
```

## Detailed Docs

- Architecture and package relationships: [../../docs/architecture.md](../../docs/architecture.md)
- Backend contract usage: [../../docs/backend.md](../../docs/backend.md)
- Frontend contract usage: [../../docs/frontend.md](../../docs/frontend.md)
