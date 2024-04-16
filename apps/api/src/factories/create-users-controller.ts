import { UsersController } from '../controllers/users-controller'
import { UsersRepository } from '../repositories/users-repository'
import { EmailService } from '../services/email-service'
import { Context } from '../trpc'

export function createUsersController(ctx: Context) {
  const usersRepository = new UsersRepository(ctx.database)
  const emailService = new EmailService()
  return new UsersController(usersRepository, emailService)
}
