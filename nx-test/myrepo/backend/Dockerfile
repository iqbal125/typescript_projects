# Production Dockerfile for the backend service.
# Build from monorepo root: docker build -f backend/Dockerfile .
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Install dependencies
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY backend/package.json ./backend/
RUN pnpm install --frozen-lockfile --filter @org/backend...

# Copy source
COPY backend/ ./backend/
COPY tsconfig.base.json ./

# Build
RUN pnpm nx build backend

EXPOSE 3000
WORKDIR /app/backend
CMD ["node", "dist/main.js"]
