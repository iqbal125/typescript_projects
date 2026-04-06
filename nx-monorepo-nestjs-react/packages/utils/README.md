# @org/utils

Shared TypeScript utilities for workspace apps.

## Step-by-Step: Use This Library In Other Apps

1. Add the library to the consumer package with pnpm workspace linking.

```bash
pnpm add @org/utils --filter @org/frontend --workspace
# or
pnpm add @org/utils --filter @org/backend --workspace
```

2. Import from the package name in app code.

```ts
import { utils } from '@org/utils';
```

3. Build the library when you need runtime output in dist.

```bash
pnpm nx build utils
```

4. Run the consumer app through Nx.

```bash
pnpm nx serve frontend
pnpm nx serve backend
```

5. Verify dependency relationships in the Nx graph.

```bash
pnpm nx graph
```

## Typical Dev Flow

1. Edit source in `packages/utils/src`.
2. Export public functions from `packages/utils/src/index.ts`.
3. Use imports from `@org/utils` in apps.
4. Rebuild with `pnpm nx build utils` before production builds or packaging.

## Notes

- This workspace uses pnpm workspaces, so dependencies should be declared explicitly in each consumer package.
- The package export map includes an `@org/source` condition for source-first workflows in tools that support custom conditions.
