# Packages

This directory contains all shared libraries and packages used across the monorepo, organised into three buckets based on where their code is safe to run.

```
packages/
  shared/     ← safe on both frontend and backend
  frontend/   ← browser/React only
  server/     ← Node/backend only
```

---

## Buckets

### `shared/` — Cross-platform

Code that is genuinely safe for **both** the frontend app and the backend server.

| Package | Name | Description |
|---------|------|-------------|
| `shared/types` | `@org/shared-types` | Shared TypeScript types and interfaces |
| `shared/utils` | `@org/shared-utils` | Pure utility functions (no runtime dependencies) |

**Good candidates for `shared/`:**
- TypeScript types and interfaces
- Validation schemas
- Constants
- Pure utility functions (string, date, math helpers)
- API contracts and DTOs
- Enums shared across the stack

**Do not put here:**
- Database or filesystem code
- Browser DOM code
- React hooks or components
- Node env loaders
- Auth session logic tied to a specific runtime

> `shared/` should stay small and strict. If something only makes sense on one side, it belongs in `frontend/` or `server/`.

---

### `frontend/` — Browser / React only

Code that targets the **browser runtime**. May use DOM APIs, React, or browser-specific globals.

| Package | Name | Description |
|---------|------|-------------|
| `frontend/ui` | — | UI component library |
| `frontend/hooks` | — | Reusable React hooks |
| `frontend/design-system` | — | Design tokens, theme, and base styles |

**Good candidates for `frontend/`:**
- React component libraries
- React hooks
- API client wrappers (browser fetch/axios)
- Feature flag clients
- Browser analytics helpers

**Do not put here:**
- Generic schemas or types (→ `shared/`)
- API contracts (→ `shared/`)
- Anything that imports Node built-ins (`fs`, `path`, `crypto`, etc.)

---

### `server/` — Node / Backend only

Code that targets the **Node.js runtime**. May use Node built-ins, database drivers, or server-only secrets.

| Package | Name | Description |
|---------|------|-------------|
| `server/db` | `@org/server-db` | Database schema, migrations, and query helpers (Drizzle ORM) |
| `server/config` | — | Server-side configuration and environment loading |

**Good candidates for `server/`:**
- Database access (ORM schemas, migrations, query helpers)
- Server-side auth logic
- Background workers and queues
- Node env / secrets loaders
- Server-side services

**Do not put here:**
- Anything that should be shared with the browser (→ `shared/`)
- React or DOM code

---

## Import boundary rules

These rules are enforced by ESLint import-boundary checks:

| Consumer | Can import from | Cannot import from |
|----------|-----------------|--------------------|
| `apps/frontend` | `shared/`, `frontend/` | `server/` |
| `apps/backend` | `shared/`, `server/` | `frontend/` |
| `packages/shared` | — | `frontend/`, `server/` |
| `packages/frontend` | `shared/` | `server/` |
| `packages/server` | `shared/` | `frontend/` |

### Example imports

```ts
// ✅ shared — safe everywhere
import { UserDto } from "@org/shared-types";

// ✅ frontend-only
import { Button } from "@org/ui";

// ✅ server-only
import { getDb } from "@org/server-db";

// ❌ never import server code into the frontend app
import { getDb } from "@org/server-db"; // inside apps/frontend — blocked by lint
```

---

## Package naming convention

Package names follow the pattern `@org/{bucket}-{name}`, where `{bucket}` matches the folder grouping:

| Bucket | Folder | Package name pattern | Example |
|--------|--------|---------------------|---------|
| shared | `packages/shared/<name>/` | `@org/shared-<name>` | `@org/shared-types` |
| frontend | `packages/frontend/<name>/` | `@org/frontend-<name>` | `@org/frontend-ui` |
| server | `packages/server/<name>/` | `@org/server-<name>` | `@org/server-db` |

This makes it immediately clear from any import which runtime bucket a package belongs to.

### Subpath exports

Packages can expose subpath exports for more granular imports. For example, `@org/shared-types` exposes:

```ts
// Broad import (barrel — re-exports everything)
import { CreateTodoSchema, TodoDto } from '@org/shared-types';

// Targeted imports (preferred)
import { CreateTodoSchema } from '@org/shared-types/todo/requests';
import type { TodoDto } from '@org/shared-types/todo/responses';
```

Subpath exports are configured in the package's `package.json` under `"exports"`:

```jsonc
{
  "exports": {
    ".": { /* barrel */ },
    "./todo/requests": { /* maps to src/lib/todo/requests.ts */ },
    "./todo/responses": { /* maps to src/lib/todo/responses.ts */ }
  }
}
```

Prefer targeted subpath imports over the barrel to keep dependency graphs narrow and build times fast.

---

## Adding a new package

1. Decide which bucket it belongs to (`shared`, `frontend`, or `server`).
2. Create the folder under the appropriate bucket directory.
3. Add a `package.json` following the naming convention:
   - `@org/shared-<name>` for shared packages
   - `@org/frontend-<name>` for frontend packages  
   - `@org/server-<name>` for server packages
4. Add a `tsconfig.json` that extends the root `tsconfig.base.json`.
5. Register the package path in the root `tsconfig.base.json` paths.
