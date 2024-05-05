import { PaymentsController } from '../controllers/payments-controller'
import { PaymentsRepository } from '../repositories/payments-repository'
import { UsersRepository } from '../repositories/users-repository'
import { Context } from '../trpc'

export function createPaymentsController(ctx: Context) {
  const usersRepository = new UsersRepository(ctx.database)
  const paymentsRepository = new PaymentsRepository(usersRepository)

  return new PaymentsController(paymentsRepository)
}
