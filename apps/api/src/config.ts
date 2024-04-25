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
  isUnderMaintenance: z.boolean(),
  apiKeyForPublicEndpoints: z.string(),
  appWebDomain: z.string(),
  token: z.object({
    encryptionKey: z.string().length(32),
    initVector: z.string().length(16)
  }),
  stripe: z.object({
    apiKey: z.string(),
    monthlyProductId: z.string()
  })
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
  isUnderMaintenance: process.env.IS_UNDER_MAINTENENCE === 'true',
  apiKeyForPublicEndpoints: process.env.API_KEY_FOR_PUBLIC_ENDPOINTS,
  appWebDomain: process.env.APP_WEB_DOMAIN,
  token: {
    encryptionKey: process.env.AUTH_ENCRIPTION_KEY,
    initVector: process.env.AUTH_INIT_VECTOR
  },
  stripe: {
    apiKey: process.env.STRIPE_API_KEY,
    monthlyProductId: process.env.STRIPE_MONTHLY_PRODUCT_ID
  }
})
