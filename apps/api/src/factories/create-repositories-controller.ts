import { RepositoriesController } from '../controllers/repositories-controller'
import { GithubKitRepository } from '../repositories/github-kit-repository'
import { UsersRepository } from '../repositories/users-repository'
import { Context } from '../trpc'

export function createRepositoriesController(ctx: Context) {
  const usersRepository = new UsersRepository(ctx.database)
  const githubKitRepository = new GithubKitRepository()
  return new RepositoriesController(usersRepository, githubKitRepository)
}
