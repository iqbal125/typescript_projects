import { z } from "zod"

export const clientEnvSchema = z.object({
  VITE_API_URL: z.string(),
})

export const viteConfigEnvSchema = clientEnvSchema.extend({
  VITE_FRONTEND_HOST: z.string().min(1).default("localhost"),
  VITE_FRONTEND_PORT: z.coerce.number().int().positive().default(4200),
})

export const frontendEnvSchema = z.object({
  VITE_API_URL: z.string(),
  VITE_FRONTEND_HOST: z.string().min(1).default("localhost"),
  VITE_FRONTEND_PORT: z.string().min(1).default("4200"),
})

export type FrontendEnv = z.infer<typeof frontendEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>
export type ViteConfigEnv = z.infer<typeof viteConfigEnvSchema>
