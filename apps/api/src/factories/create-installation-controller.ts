import { InstallationController } from '../controllers/installation-controller'
import { InstallationRepository } from '../repositories/installation-repository'
import { ReposConfigurationsRepository } from '../repositories/repos-configurations-repository'
import { UsersRepository } from '../repositories/users-repository'
import { Context } from '../trpc'

export function createInstallationController(ctx: Context) {
  const usersRepository = new UsersRepository(ctx.database)
  const reposConfigurationsRepository = new ReposConfigurationsRepository(
    ctx.database
  )
  const installationRepository = new InstallationRepository(
    usersRepository,
    reposConfigurationsRepository
  )
  return new InstallationController(installationRepository)
}
