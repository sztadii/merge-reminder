import { WarningsController } from '../controllers/warnings-controller'
import { GithubAppRepository } from '../repositories/github-app-repository'
import { ReposConfigurationsRepository } from '../repositories/repos-configurations-repository'
import { UsersRepository } from '../repositories/users-repository'
import { WarningsRepository } from '../repositories/warnings-repository'
import { EmailService } from '../services/email-service'
import { Context } from '../trpc'

export function createWarningsController(ctx: Context) {
  const usersRepository = new UsersRepository(ctx.database)
  const emailService = new EmailService()
  const reposConfigurationsRepository = new ReposConfigurationsRepository(
    ctx.database
  )
  const githubAppRepository = new GithubAppRepository()
  const warningsRepository = new WarningsRepository(githubAppRepository)

  return new WarningsController(
    usersRepository,
    warningsRepository,
    reposConfigurationsRepository,
    emailService
  )
}
