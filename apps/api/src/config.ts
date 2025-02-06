import * as z from 'zod'

const NonEmptyStringSchema = z.string().trim().min(1)

const configSchema = z.object({
  app: z.object({
    apiKeyForPublicEndpoints: NonEmptyStringSchema,
    isUnderMaintenance: z.boolean(),
    webDomain: NonEmptyStringSchema,
    mode: NonEmptyStringSchema,
    port: z.number(),
    freeTrialLengthInDays: z.number()
  }),
  mongo: z.object({
    url: NonEmptyStringSchema
  }),
  github: z.object({
    authClientId: NonEmptyStringSchema,
    authClientSecret: NonEmptyStringSchema,
    appId: NonEmptyStringSchema,
    appPrivateKey: NonEmptyStringSchema
  }),
  mail: z.object({
    apiKey: NonEmptyStringSchema
  }),
  auth: z.object({
    encryptionKey: NonEmptyStringSchema.length(32),
    initVector: NonEmptyStringSchema.length(16)
  }),
  stripe: z.object({
    apiKey: NonEmptyStringSchema,
    monthlyProductId: NonEmptyStringSchema
  })
})

export const config = configSchema.parse({
  app: {
    apiKeyForPublicEndpoints: process.env.APP_API_KEY_FOR_PUBLIC_ENDPOINTS,
    isUnderMaintenance: process.env.APP_IS_UNDER_MAINTENENCE === 'true',
    webDomain: process.env.APP_WEB_DOMAIN,
    mode: process.env.APP_MODE,
    port: Number(process.env.APP_PORT),
    freeTrialLengthInDays: 30
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
  mail: {
    apiKey: process.env.MAIL_API_KEY
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
