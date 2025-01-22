import { UsersController } from '@apps/api/controllers/users-controller/users-controller'
import { UsersRepository } from '@apps/api/repositories/users-repository'
import { EmailService } from '@apps/api/services/email-service'
import { Context } from '@apps/api/trpc'

export function createUsersController(ctx: Context) {
  const usersRepository = new UsersRepository(ctx.database)
  const emailService = new EmailService()
  return new UsersController(usersRepository, emailService)
}
