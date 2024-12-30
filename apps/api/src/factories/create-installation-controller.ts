import { InstallationController } from '../controllers/installation-controller'
import { GithubAppRepository } from '../repositories/github-app-repository'
import { InstallationRepository } from '../repositories/installation-repository'
import { ReposConfigurationsRepository } from '../repositories/repos-configurations-repository'
import { UsersRepository } from '../repositories/users-repository'
import { Context } from '../trpc'

export function createInstallationController(ctx: Context) {
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
  return new InstallationController(installationRepository)
}
