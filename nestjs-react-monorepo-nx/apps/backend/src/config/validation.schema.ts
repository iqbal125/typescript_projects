import { serverEnvSchema, type ServerEnv } from "@org/server-config/env";


export const validateServerEnv = (config: Record<string, unknown>): ServerEnv => {
  const parsed = serverEnvSchema.safeParse(config)

  if (!parsed.success) {
    throw new Error(`Environment validation failed`)
  }

  return parsed.data
}
