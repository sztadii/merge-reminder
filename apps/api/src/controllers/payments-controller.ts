import { TRPCError } from '@trpc/server'
import Stripe from 'stripe'

import { config } from '../config'
import { PaymentWebhook } from '../schemas'
import { EmailService } from '../services/email-service'

export class PaymentsController {
  private stripe: Stripe

  constructor(private emailService: EmailService) {
    this.stripe = new Stripe(config.stripe.apiKey)
  }

  async handleWebhookEvents(paymentWebhook: PaymentWebhook): Promise<void> {
    console.log({ paymentWebhook })
  }

  async createSubscribeUrl(): Promise<string> {
    const { appWebDomain } = config

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: config.stripe.monthlyProductId,
          quantity: 1
        }
      ],
      success_url: `${appWebDomain}/settings/?success=true`,
      cancel_url: `${appWebDomain}/settings`
    })

    if (!session.url) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while creating subscribe url.'
      })
    }

    return session.url
  }
}
