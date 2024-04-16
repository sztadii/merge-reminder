import * as z from 'zod'

const configSchema = z.object({
  github: z.object({
    authClientId: z.string(),
    authClientSecret: z.string(),
    appId: z.string(),
    appPrivateKey: z.string()
  }),
  email: z.object({
    user: z.string(),
    password: z.string()
  })
})

export const config = configSchema.parse({
  github: {
    authClientId: process.env.GITHUB_AUTH_CLIENT_ID,
    authClientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
    appId: process.env.GITHUB_APP_ID,
    appPrivateKey: process.env.GITHUB_APP_PRIVATE_KEY
  },
  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD
  }
})
