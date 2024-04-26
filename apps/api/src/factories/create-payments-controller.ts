import { PaymentsController } from '../controllers/payments-controller'
import { PaymentsRepository } from '../repositories/payments-repository'
import { EmailService } from '../services/email-service'

export function createPaymentsController() {
  const emailService = new EmailService()
  const paymentsRepository = new PaymentsRepository()

  return new PaymentsController(emailService, paymentsRepository)
}
