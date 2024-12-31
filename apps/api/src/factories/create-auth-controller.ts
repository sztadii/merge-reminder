import { AuthController } from '@apps/api/controllers/auth-controller'
import { GithubAppRepository } from '@apps/api/repositories/github-app-repository'
import { GithubAuthRepository } from '@apps/api/repositories/github-auth-repository'
import { InstallationRepository } from '@apps/api/repositories/installation-repository'
import { PaymentsRepository } from '@apps/api/repositories/payments-repository'
import { ReposConfigurationsRepository } from '@apps/api/repositories/repos-configurations-repository'
import { UsersRepository } from '@apps/api/repositories/users-repository'
import { Context } from '@apps/api/trpc'

export function createAuthController(ctx: Context) {
  const githubAuthRepository = new GithubAuthRepository()
  const usersRepository = new UsersRepository(ctx.database)
  const reposConfigurationsRepository = new ReposConfigurationsRepository(
    ctx.database
  )
  const githubAppRepository = new GithubAppRepository()
  const installationRepository = new InstallationRepository(
    usersRepository,
    githubAppRepository,
    reposConfigurationsRepository
  )
  const paymentsRepository = new PaymentsRepository(usersRepository)

  return new AuthController(
    usersRepository,
    reposConfigurationsRepository,
    githubAuthRepository,
    installationRepository,
    paymentsRepository
  )
}
