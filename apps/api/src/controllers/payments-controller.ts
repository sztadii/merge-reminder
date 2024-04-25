import { PaymentWebhook } from '../schemas'
import { EmailService } from '../services/email-service'

export class PaymentsController {
  constructor(private emailService: EmailService) {}

  async handleWebhookEvents(paymentWebhook: PaymentWebhook): Promise<void> {
    console.log({ paymentWebhook })
  }

  async createSubscribeUrl(): Promise<string> {
    return 'https://wp.pl'
  }
}
