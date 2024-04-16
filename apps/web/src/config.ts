import * as z from 'zod'

const configSchema = z.object({
  github: z.object({
    authClientId: z.string(),
    appName: z.string()
  }),
  trpc: z.object({
    url: z.string()
  })
})

export const config = configSchema.parse({
  github: {
    authClientId: process.env.GITHUB_AUTH_CLIENT_ID,
    appName: process.env.GITHUB_APP_NAME
  },
  trpc: {
    url: process.env.TRPC_URL
  }
})
