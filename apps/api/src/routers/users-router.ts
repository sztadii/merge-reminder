import {
  EmptyResponseSchema,
  UserResponseSchema,
  UserUpdateRequestSchema
} from '../schemas'
import { UsersService } from '../services/users-service'
import { protectedProcedure, router } from '../trpc'

export const usersRouter = router({
  getCurrentUser: protectedProcedure.output(UserResponseSchema).query(opts => {
    const usersService = new UsersService(opts.ctx.database)
    return usersService.getById(opts.ctx.user.id)
  }),
  updateCurrentUser: protectedProcedure
    .input(UserUpdateRequestSchema)
    .output(UserResponseSchema)
    .mutation(opts => {
      const usersService = new UsersService(opts.ctx.database)
      return usersService.updateById(opts.ctx.user.id, opts.input)
    }),
  deleteCurrentUser: protectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersService = new UsersService(opts.ctx.database)
      return usersService.deleteById(opts.ctx.user.id)
    })
})
