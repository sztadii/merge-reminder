import { PaymentsController } from '../controllers/payments-controller'
import { PaymentsRepository } from '../repositories/payments-repository'
import { UsersRepository } from '../repositories/users-repository'
import { EmailService } from '../services/email-service'
import { Context } from '../trpc'

export function createPaymentsController(ctx: Context) {
  const emailService = new EmailService()
  const usersRepository = new UsersRepository(ctx.database)
  const paymentsRepository = new PaymentsRepository(usersRepository)

  return new PaymentsController(emailService, paymentsRepository)
}
