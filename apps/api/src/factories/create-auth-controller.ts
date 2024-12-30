import { AuthController } from '../controllers/auth-controller'
import { GithubAppRepository } from '../repositories/github-app-repository'
import { GithubAuthRepository } from '../repositories/github-auth-repository'
import { InstallationRepository } from '../repositories/installation-repository'
import { PaymentsRepository } from '../repositories/payments-repository'
import { ReposConfigurationsRepository } from '../repositories/repos-configurations-repository'
import { UsersRepository } from '../repositories/users-repository'
import { Context } from '../trpc'

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
