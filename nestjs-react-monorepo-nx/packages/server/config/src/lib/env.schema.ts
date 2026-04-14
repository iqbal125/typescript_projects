import { z } from "zod"

const portSchema = z.coerce.number().int().min(1).max(65535)

const corsEnabledSchema = z.preprocess((value: unknown) => {
  if (typeof value === "boolean") return value

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()
    if (normalized === "true" || normalized === "1") return true
    if (normalized === "false" || normalized === "0") return false
  }

  return value
}, z.boolean())

export const serverEnvSchema = z.looseObject({
  NODE_ENV: z.enum(["development", "production", "test", "staging"]).default("development"),
  BACKEND_PORT: portSchema,
  BACKEND_HOST: z.string().min(1),
  APP_NAME: z.string().default("SaaS Kit API"),
  APP_VERSION: z.string().default("1.0.0"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32).default("default-secret-change-me-in-production"),
  JWT_EXPIRATION: z.string().regex(/^(\d+)(s|m|h|d)$/).default("24h"),
  SWAGGER_TITLE: z.string().default("API Documentation"),
  SWAGGER_DESCRIPTION: z.string().default("API Description"),
  SWAGGER_VERSION: z.string().default("1.0"),
  CORS_ENABLED: corsEnabledSchema.default(true),
  CORS_ORIGIN: z.string(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>
