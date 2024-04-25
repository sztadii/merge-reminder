import * as z from 'zod'

export const PaymentWebhookSchema = z.object({
  id: z.string(),
  object: z.string(),
  api_version: z.string(),
  created: z.number(),
  type: z.string(),
  data: z.object({
    object: z.object({
      id: z.string(),
      object: z.string(),
      amount: z.number(),
      amount_capturable: z.number(),
      amount_received: z.number(),
      application: z.any().nullable(),
      application_fee_amount: z.any().nullable(),
      automatic_payment_methods: z.any().nullable(),
      canceled_at: z.any().nullable(),
      cancellation_reason: z.any().nullable(),
      capture_method: z.string(),
      client_secret: z.string(),
      confirmation_method: z.string(),
      created: z.number(),
      currency: z.string(),
      customer: z.any().nullable(),
      description: z.string(),
      invoice: z.any().nullable(),
      last_payment_error: z.any().nullable(),
      latest_charge: z.any().nullable(),
      livemode: z.boolean(),
      next_action: z.any().nullable(),
      on_behalf_of: z.any().nullable(),
      payment_method: z.any().nullable(),
      payment_method_configuration_details: z.any().nullable(),
      payment_method_options: z.object({
        card: z.object({
          installments: z.any().nullable(),
          mandate_options: z.any().nullable(),
          network: z.any().nullable(),
          request_three_d_secure: z.string()
        })
      }),
      payment_method_types: z.array(z.string()),
      processing: z.any().nullable(),
      receipt_email: z.any().nullable(),
      review: z.any().nullable(),
      setup_future_usage: z.any().nullable(),
      shipping: z.object({
        address: z.object({
          city: z.string(),
          country: z.string(),
          line1: z.string().nullable(),
          line2: z.string().nullable(),
          postal_code: z.string(),
          state: z.string()
        }),
        carrier: z.any().nullable(),
        name: z.string(),
        phone: z.any().nullable(),
        tracking_number: z.any().nullable()
      }),
      source: z.any().nullable(),
      statement_descriptor: z.any().nullable(),
      statement_descriptor_suffix: z.any().nullable(),
      status: z.string(),
      transfer_data: z.any().nullable(),
      transfer_group: z.any().nullable()
    })
  })
})

export type PaymentWebhook = z.infer<typeof PaymentWebhookSchema>
