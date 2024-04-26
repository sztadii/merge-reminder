import { TRPCError } from '@trpc/server'
import Stripe from 'stripe'

import { config } from '../config'
import { PaymentsRepository } from '../repositories/payments-repository'
import { PaymentWebhook } from '../schemas'
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
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while getting webhook event.'
      })
    }
  }

  async createSubscribeUrl(): Promise<string> {
    const url = await this.paymentsRepository.createSubscribeUrl()

    if (!url) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while creating subscribe url.'
      })
    }

    return url
  }
}
