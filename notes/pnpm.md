If you’re running a monorepo with **pnpm**, there are a bunch of commands that make life *way* easier—especially once you start juggling multiple packages, shared deps, and builds.

I’ll break this into the stuff you’ll actually use day-to-day 👇

---

# 🔧 Core Workspace Setup

### Install dependencies (entire monorepo)

```bash
pnpm install
```

* Installs all workspace deps
* Creates a **single lockfile**
* Uses symlinks → super fast + disk efficient

---

### Add a dependency to a specific package

```bash
pnpm add lodash --filter my-app
```

Or from inside the package:

```bash
pnpm add lodash
```

---

### Add a dependency to the root (shared tooling)

```bash
pnpm add -D typescript -w
```

---

# 🎯 Filtering (Most Important Feature)

Filtering is what makes pnpm 🔥 for monorepos.

### Run a script in one package

```bash
pnpm --filter my-app dev
```

---

### Run across multiple packages

```bash
pnpm --filter "./packages/*" build
```

---

### Run only changed packages (great for CI)

```bash
pnpm --filter ...[origin/main] build
```

---

### Run package + its dependencies

```bash
pnpm --filter my-app... build
```

### Run package + dependents

```bash
pnpm --filter ...my-lib build
```

---

# 🚀 Running Scripts

### Run script in all packages

```bash
pnpm -r build
```

---

### Run in parallel

```bash
pnpm -r --parallel dev
```

---

### Run sequentially (dependency order)

```bash
pnpm -r --workspace-concurrency=1 build
```

---

# 📦 Dependency Management

### Add internal package dependency

```bash
pnpm add my-lib --filter my-app
```

Automatically links via workspace.

---

### Update dependencies

```bash
pnpm update
```

---

### Check outdated deps

```bash
pnpm outdated
```

---

### Remove dependency

```bash
pnpm remove lodash --filter my-app
```

---

# 🔗 Workspace Protocol (Super Important)

Use this in `package.json`:

```json
{
  "dependencies": {
    "my-lib": "workspace:*"
  }
}
```

Other options:

* `workspace:^` → follows semver
* `workspace:*` → always latest local

---

# 🧠 Useful Debug / Maintenance

### Why is a package installed?

```bash
pnpm why lodash
```

---

### List installed deps

```bash
pnpm list
```

---

### Prune unused packages

```bash
pnpm prune
```

---

### Clean install (nuke + reinstall)

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

# ⚡ Store & Performance Tricks

### Check global store path

```bash
pnpm store path
```

---

### Clean store

```bash
pnpm store prune
```

---

# 🧪 CI / Production Tips

### Install only prod deps

```bash
pnpm install --prod
```

---

### Frozen lockfile (CI best practice)

```bash
pnpm install --frozen-lockfile
```

---

### Run tests only where needed

```bash
pnpm --filter ...[origin/main] test
```

---

# 🏗️ Power Moves (Advanced)

### Recursive exec (run arbitrary command)

```bash
pnpm -r exec echo hello
```

---

### Run script only if it exists

```bash
pnpm -r --if-present test
```

---

### Workspace root scripts controlling everything

```json
{
  "scripts": {
    "build": "pnpm -r build",
    "dev": "pnpm -r --parallel dev"
  }
}
```

---

# 🧩 Typical Monorepo Structure

```bash
.
├── apps/
│   ├── web
│   └── api
├── packages/
│   ├── ui
│   └── utils
├── pnpm-workspace.yaml
```

---

# 🧠 Real-World Tips (Based on Your Stack)

Since you’re working with **Next.js + FastAPI + internal libs**, these matter most:

* Use `--filter app...` when building → ensures shared libs build first
* Use `workspace:*` for internal packages → avoids version drift
* Combine with **Turbo/Nx later if needed**, but pnpm alone is already powerful
* For CI: `...[origin/main]` is huge for speeding builds

---

If you want, I can tailor this to your exact setup (e.g., **Next.js app + shared UI + FastAPI backend + CDK infra**) and give you a clean production-ready pnpm workspace config + scripts.
