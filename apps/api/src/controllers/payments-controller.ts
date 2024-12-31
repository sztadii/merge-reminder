import Stripe from 'stripe'

import { PaymentWebhook, UpdateCheckoutSession } from '@apps/shared/schemas'

import { config } from '@apps/api/config'
import { UnexpectedError } from '@apps/api/errors/common-errors'
import { PaymentsRepository } from '@apps/api/repositories/payments-repository'
import { EmailService } from '@apps/api/services/email-service'

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
