import { PaymentsController } from '@apps/api/controllers/payments-controller/payments-controller'
import { PaymentsRepository } from '@apps/api/repositories/payments-repository'
import { UsersRepository } from '@apps/api/repositories/users-repository'
import { EmailService } from '@apps/api/services/email-service'
import { Context } from '@apps/api/trpc'

export function createPaymentsController(ctx: Context) {
  const emailService = new EmailService()
  const usersRepository = new UsersRepository(ctx.database)
  const paymentsRepository = new PaymentsRepository(usersRepository)

  return new PaymentsController(emailService, paymentsRepository)
}
