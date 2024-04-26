import Stripe from 'stripe'

import { config } from '../config'
import { PaymentWebhook, UpdateCheckoutSession } from '../schemas'
import { UsersRepository } from './users-repository'

export class PaymentsRepository {
  private stripe: Stripe

  constructor(private usersRepository: UsersRepository) {
    this.stripe = new Stripe(config.stripe.apiKey)
  }

  async handleWebhookEvents(paymentWebhook: PaymentWebhook): Promise<void> {
    console.log({ paymentWebhook })
  }

  async updateCheckoutSessionId(
    userId: string,
    checkoutSession: UpdateCheckoutSession
  ): Promise<void> {
    await this.usersRepository.updateById(userId, {
      stripeCheckoutSessionId: checkoutSession.sessionId
    })
  }

  async createSubscribeUrl(userId: string): Promise<string | null> {
    const user = await this.usersRepository.getById(userId).catch()

    const userEmail = user?.email

    if (!userEmail) {
      throw new Error('No userEmail')
    }

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
      cancel_url: `${webDomain}/settings`,
      customer_email: userEmail
    })

    return session.url
  }

  async unsubscribe(userId: string): Promise<void> {
    const user = await this.usersRepository.getById(userId).catch()

    const stripeCheckoutSessionId = user?.stripeCheckoutSessionId

    if (!stripeCheckoutSessionId) {
      throw new Error('No stripeCheckoutSessionId')
    }

    const session = await this.stripe.checkout.sessions
      .retrieve(stripeCheckoutSessionId)
      .catch()

    const subscriptionId = session?.subscription
    const customerId = session?.customer

    if (typeof subscriptionId !== 'string') {
      throw new Error('No subscriptionId')
    }

    if (typeof customerId !== 'string') {
      throw new Error('No customerId')
    }

    await this.stripe.subscriptions.cancel(subscriptionId)
    await this.stripe.customers.del(customerId)

    await this.usersRepository.updateById(userId, {
      stripeCheckoutSessionId: null
    })
  }
}
