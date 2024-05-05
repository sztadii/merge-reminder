import * as z from 'zod'

export const PaymentWebhookSchema = z.any()

export type PaymentWebhook = z.infer<typeof PaymentWebhookSchema>

export const UpdateCheckoutSessionSchema = z.object({
  sessionId: z.string().nullable()
})

export type UpdateCheckoutSession = z.infer<typeof UpdateCheckoutSessionSchema>
