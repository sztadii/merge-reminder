import * as z from 'zod'

const configSchema = z.object({
  app: z.object({
    apiKeyForPublicEndpoints: z.string(),
    isUnderMaintenance: z.boolean(),
    webDomain: z.string(),
    mode: z.string(),
    port: z.string()
  }),
  mongo: z.object({
    url: z.string()
  }),
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
  auth: z.object({
    encryptionKey: z.string().length(32),
    initVector: z.string().length(16)
  }),
  stripe: z.object({
    apiKey: z.string(),
    monthlyProductId: z.string()
  })
})

export const config = configSchema.parse({
  app: {
    apiKeyForPublicEndpoints: process.env.APP_API_KEY_FOR_PUBLIC_ENDPOINTS,
    isUnderMaintenance: process.env.APP_IS_UNDER_MAINTENENCE === 'true',
    webDomain: process.env.APP_WEB_DOMAIN,
    mode: process.env.APP_MODE,
    port: process.env.APP_PORT
  },
  mongo: {
    url: process.env.MONGO_URL
  },
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
  auth: {
    encryptionKey: process.env.AUTH_ENCRIPTION_KEY,
    initVector: process.env.AUTH_INIT_VECTOR
  },
  stripe: {
    apiKey: process.env.STRIPE_API_KEY,
    monthlyProductId: process.env.STRIPE_MONTHLY_PRODUCT_ID
  }
})
