import { ReposConfigurationsController } from '../controllers/repos-configurations-controller'
import { ReposConfigurationsRepository } from '../repositories/repos-configurations-repository'
import { Context } from '../trpc'

export function createReposConfigurationsController(ctx: Context) {
  const reposConfigurationsRepository = new ReposConfigurationsRepository(
    ctx.database
  )
  return new ReposConfigurationsController(reposConfigurationsRepository)
}
