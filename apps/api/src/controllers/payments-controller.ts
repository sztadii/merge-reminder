import Stripe from 'stripe'

import { config } from '../config'
import { UnexpectedError } from '../errors/common-errors'
import { PaymentsRepository } from '../repositories/payments-repository'
import { PaymentWebhook, UpdateCheckoutSession } from '../schemas'
import { EmailService } from '../services/email-service'

export class PaymentsController {
  private stripe: Stripe

  constructor(
    private emailService: EmailService,
    private paymentsRepository: PaymentsRepository
  ) {
    this.stripe = new Stripe(config.stripe.apiKey)
  }

  async handleWebhookEvents(paymentWebhook: PaymentWebhook): Promise<void> {
    try {
      await this.paymentsRepository.handleWebhookEvents(paymentWebhook)
    } catch {
      throw new UnexpectedError(
        'An error occurred while receiving webhook event.'
      )
    }
  }

  async updateCheckoutSessionId(
    userId: string,
    checkoutSession: UpdateCheckoutSession
  ): Promise<void> {
    try {
      await this.paymentsRepository.updateCheckoutSessionId(
        userId,
        checkoutSession
      )
    } catch {
      throw new UnexpectedError(
        'An error occurred while updating checkout session.'
      )
    }
  }

  async createSubscribeUrl(userId: string): Promise<string> {
    const url = await this.paymentsRepository.createSubscribeUrl(userId).catch()

    if (!url) {
      throw new UnexpectedError(
        'An error occurred while creating subscribe url.'
      )
    }

    return url
  }

  async unsubscribe(userId: string): Promise<void> {
    await this.paymentsRepository.unsubscribe(userId)
  }
}
