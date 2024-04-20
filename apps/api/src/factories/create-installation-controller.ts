import { InstallationController } from '../controllers/installation-controller'
import { InstallationRepository } from '../repositories/installation-repository'
import { UsersRepository } from '../repositories/users-repository'
import { Context } from '../trpc'

export function createInstallationController(ctx: Context) {
  const usersRepository = new UsersRepository(ctx.database)
  const installationRepository = new InstallationRepository(usersRepository)
  return new InstallationController(installationRepository)
}
