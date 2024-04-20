import { WarningsController } from '../controllers/warnings-controller'
import { ReposConfigurationsRepository } from '../repositories/repos-configurations-repository'
import { UsersRepository } from '../repositories/users-repository'
import { EmailService } from '../services/email-service'
import { Context } from '../trpc'

export function createWarningsController(ctx: Context) {
  const usersRepository = new UsersRepository(ctx.database)
  const emailService = new EmailService()
  const reposConfigurationsRepository = new ReposConfigurationsRepository(
    ctx.database
  )
  return new WarningsController(
    usersRepository,
    reposConfigurationsRepository,
    emailService
  )
}
