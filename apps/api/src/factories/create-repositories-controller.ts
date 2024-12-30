import { RepositoriesController } from '../controllers/repositories-controller'
import { GithubAppRepository } from '../repositories/github-app-repository'
import { UsersRepository } from '../repositories/users-repository'
import { Context } from '../trpc'

export function createRepositoriesController(ctx: Context) {
  const usersRepository = new UsersRepository(ctx.database)
  const githubAppRepository = new GithubAppRepository()
  return new RepositoriesController(usersRepository, githubAppRepository)
}
