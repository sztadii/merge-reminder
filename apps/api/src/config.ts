import * as z from 'zod'

const configSchema = z.object({
  github: z.object({
    authClientId: z.string(),
    authClientSecret: z.string(),
    appId: z.string(),
    appPrivateKey: z.string()
  }),
  mailgun: z.object({
    domainName: z.string(),
    apiKey: z.string()
  }),
  isUnderMaintenance: z.boolean()
})

export const config = configSchema.parse({
  github: {
    authClientId: process.env.GITHUB_AUTH_CLIENT_ID,
    authClientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
    appId: process.env.GITHUB_APP_ID,
    appPrivateKey: process.env.GITHUB_APP_PRIVATE_KEY
  },
  mailgun: {
    domainName: process.env.MAILGUN_DOMAIN_NAME,
    apiKey: process.env.MAILGUN_API_KEY
  },
  isUnderMaintenance: process.env.IS_UNDER_MAINTENENCE === 'true'
})
