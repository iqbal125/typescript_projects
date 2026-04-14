# Package Management

Workspace dependency operations, workspace package registration, and internal package rename workflow.

All commands are executed from workspace root unless stated otherwise.

## Add and Remove Dependencies

Use these commands when you want to add or remove npm dependencies in an existing workspace package.

```bash
# Root workspace package.json
pnpm add -w <package>
pnpm add -Dw <package>
pnpm remove -w <package>

# Backend
pnpm --filter @org/backend add <package>
pnpm --filter @org/backend add -D <package>
pnpm --filter @org/backend remove <package>

# Frontend
pnpm --filter @org/frontend add <package>
pnpm --filter @org/frontend add -D <package>
pnpm --filter @org/frontend remove <package>

# Shared workspace packages
pnpm --filter @org/server-db add <package>
pnpm --filter @org/server-db add -D <package>
pnpm --filter @org/server-db remove <package>

pnpm --filter @org/shared-types add <package>
pnpm --filter @org/shared-types add -D <package>
pnpm --filter @org/shared-types remove <package>

pnpm --filter @org/shared-utils add <package>
pnpm --filter @org/shared-utils add -D <package>
pnpm --filter @org/shared-utils remove <package>
```

## Add or Remove Workspace Package Directories

Use this when you want pnpm to treat a folder as part of the monorepo workspace (for example `frontend`, `backend`, or `packages/*`).

`pnpm add` does not register workspace directories. It only adds dependencies.

A directory is only recognized as a workspace package if it contains a `package.json`. An empty folder that matches a workspace glob will not appear in pnpm output.

### 1. Edit `pnpm-workspace.yaml`

Add or remove folder globs under `packages:`.

Example:

```yaml
packages:
  - 'packages/*'
  - 'apps/frontend'
  - 'apps/backend'
  - 'tools/*'
```

### 2. Install to refresh workspace links

```bash
pnpm install
```

If you are adding a brand new workspace package, create its `package.json` before this step.

### 3. Verify pnpm sees the package

```bash
pnpm -r list --depth -1
```

If the new project has a `package.json` with a valid `name`, it should appear in the recursive list. Empty directories will be ignored.

## Rename an Internal Package

Use this flow when renaming a workspace package (for example, `<old-package>` to `<new-package>`) and you want all references updated.

### 1. Rename the package at the source

Update the `name` field in the package's own `package.json`.

Example:

```json
{
  "name": "<new-package>"
}
```

### 2. Update consumer dependencies

For each app/package that depends on `<old-package>`, remove old and add new.

```bash
pnpm --filter <consumer-package> remove <old-package>
pnpm --filter <consumer-package> add <new-package> --workspace
```

Repeat for every consumer.

### 3. Update import and export specifiers

Replace all `from '<old-package>'` (and equivalent export statements) with `<new-package>` in code.

Practical approach:
- Use VS Code global find/replace scoped to workspace.
- Review each change before apply.

### 4. Update documentation references

Replace `<old-package>` with `<new-package>` in docs and package READMEs.

### 5. Refresh lockfile and links

```bash
pnpm install
```

This updates workspace links and `pnpm-lock.yaml`.

## Verification Checklist

1. No stale references remain:

```bash
rg -n "<old-package>" .
```

2. Workspace resolves and builds with the new package name:

```bash
pnpm nx run-many -t typecheck
pnpm nx run-many -t build
```

3. Optional quality checks:

```bash
pnpm nx run-many -t lint
pnpm nx run-many -t test
```

## Related Docs

- [commands.md](commands.md)
- [architecture.md](architecture.md)
- [frontend.md](frontend.md)
- [backend.md](backend.md)
