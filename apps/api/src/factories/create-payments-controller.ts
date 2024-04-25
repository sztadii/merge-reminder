import { PaymentsController } from '../controllers/payments-controller'
import { EmailService } from '../services/email-service'

export function createPaymentsController() {
  const emailService = new EmailService()

  return new PaymentsController(emailService)
}
