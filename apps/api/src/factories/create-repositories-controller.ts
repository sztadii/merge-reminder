import { RepositoriesController } from '@apps/api/controllers/repositories-controller'
import { GithubKitRepository } from '@apps/api/repositories/github-kit-repository'
import { UsersRepository } from '@apps/api/repositories/users-repository'
import { Context } from '@apps/api/trpc'

export function createRepositoriesController(ctx: Context) {
  const usersRepository = new UsersRepository(ctx.database)
  const githubKitRepository = new GithubKitRepository()
  return new RepositoriesController(usersRepository, githubKitRepository)
}
