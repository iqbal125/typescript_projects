import { clientEnvSchema, ClientEnv } from "@org/frontend-config"

const parsedClientEnv = clientEnvSchema.safeParse(import.meta.env)

if (!parsedClientEnv.success) {
  throw new Error(
    `Invalid frontend environment variables`,
  )
}

const env: ClientEnv = parsedClientEnv.data

export const config = {
  apiUrl: env.VITE_API_URL,
}
