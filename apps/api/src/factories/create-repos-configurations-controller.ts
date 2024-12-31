import { ReposConfigurationsController } from '@apps/api/controllers/repos-configurations-controller'
import { ReposConfigurationsRepository } from '@apps/api/repositories/repos-configurations-repository'
import { Context } from '@apps/api/trpc'

export function createReposConfigurationsController(ctx: Context) {
  const reposConfigurationsRepository = new ReposConfigurationsRepository(
    ctx.database
  )
  return new ReposConfigurationsController(reposConfigurationsRepository)
}
