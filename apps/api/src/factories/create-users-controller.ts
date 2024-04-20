import { UsersController } from '../controllers/users-controller'
import { UsersRepository } from '../repositories/users-repository'
import { Context } from '../trpc'

export function createUsersController(ctx: Context) {
  const usersRepository = new UsersRepository(ctx.database)
  return new UsersController(usersRepository)
}
