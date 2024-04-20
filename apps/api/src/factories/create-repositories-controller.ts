import { RepositoriesController } from '../controllers/repositories-controller'
import { UsersRepository } from '../repositories/users-repository'
import { Context } from '../trpc'

export function createRepositoriesController(ctx: Context) {
  const usersRepository = new UsersRepository(ctx.database)
  return new RepositoriesController(usersRepository)
}
