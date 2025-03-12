import { WarningsController } from '@apps/api/controllers/warnings-controller/warnings-controller'
import { GithubKitRepository } from '@apps/api/repositories/github-kit-repository'
import { ReposConfigurationsRepository } from '@apps/api/repositories/repos-configurations-repository'
import { UsersRepository } from '@apps/api/repositories/users-repository'
import { WarningsRepository } from '@apps/api/repositories/warnings-repository'
import { EmailService } from '@apps/api/services/email-service'
import { Context } from '@apps/api/trpc'

export function createWarningsController(ctx: Context) {
  const usersRepository = new UsersRepository(ctx.database)
  const emailService = new EmailService()
  const reposConfigurationsRepository = new ReposConfigurationsRepository(
    ctx.database
  )
  const githubKitRepository = new GithubKitRepository()
  const warningsRepository = new WarningsRepository(githubKitRepository)

  return new WarningsController(
    usersRepository,
    warningsRepository,
    reposConfigurationsRepository,
    emailService,
    ctx.logger
  )
}
