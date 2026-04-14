import { frontendEnvSchema } from "@org/frontend-config"

const parsedEnv = frontendEnvSchema.safeParse(process.env)

if (!parsedEnv.success) {
  throw new Error(
    `Invalid frontend environment variables`,
  )
}

export const env: NodeJS.ProcessEnv = {
  ...process.env,
};
