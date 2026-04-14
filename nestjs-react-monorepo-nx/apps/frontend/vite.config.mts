import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { workspaceRoot } from "@nx/devkit"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, workspaceRoot, "")
  const host = env.VITE_FRONTEND_HOST || "localhost"
  const port = Number(env.VITE_FRONTEND_PORT) || 4200

  return {
    root: import.meta.dirname,
    envDir: workspaceRoot,
    cacheDir: "../../node_modules/.vite/frontend",
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    server: {
      host,
      port,
    },
    preview: {
      host,
      port,
    },
    build: {
      outDir: "./dist",
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  }
})