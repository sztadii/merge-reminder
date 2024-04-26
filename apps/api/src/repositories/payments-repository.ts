import Stripe from 'stripe'

import { config } from '../config'
import { PaymentWebhook } from '../schemas'

export class PaymentsRepository {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(config.stripe.apiKey)
  }

  async handleWebhookEvents(paymentWebhook: PaymentWebhook): Promise<void> {
    console.log({ paymentWebhook })
  }

  async createSubscribeUrl(): Promise<string | null> {
    const { webDomain } = config.app

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: config.stripe.monthlyProductId,
          quantity: 1
        }
      ],
      success_url: `${webDomain}/settings/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${webDomain}/settings`
    })

    return session.url
  }
}
