import { InstallationController } from '@apps/api/controllers/installation-controller'
import { GithubAppRepository } from '@apps/api/repositories/github-app-repository'
import { InstallationRepository } from '@apps/api/repositories/installation-repository'
import { ReposConfigurationsRepository } from '@apps/api/repositories/repos-configurations-repository'
import { UsersRepository } from '@apps/api/repositories/users-repository'
import { Context } from '@apps/api/trpc'

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
