import { AuthController } from '../controllers/auth-controller'
import { GithubAuthRepository } from '../repositories/github-auth-repository'
import { InstallationRepository } from '../repositories/installation-repository'
import { ReposConfigurationsRepository } from '../repositories/repos-configurations-repository'
import { UsersRepository } from '../repositories/users-repository'
import { Context } from '../trpc'

export function createAuthController(ctx: Context) {
  const githubAuthRepository = new GithubAuthRepository()
  const usersRepository = new UsersRepository(ctx.database)
  const reposConfigurationsRepository = new ReposConfigurationsRepository(
    ctx.database
  )
  const installationRepository = new InstallationRepository(
    usersRepository,
    reposConfigurationsRepository
  )

  return new AuthController(
    usersRepository,
    reposConfigurationsRepository,
    githubAuthRepository,
    installationRepository
  )
}
