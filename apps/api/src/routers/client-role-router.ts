import {
  EmptyResponseSchema,
  UserResponseSchema,
  UserUpdateRequestSchema,
  WarningsResponseSchema
} from '../schemas'
import { UsersService } from '../services/users-service'
import { WarningsService } from '../services/warnings-service'
import { protectedProcedure, router } from '../trpc'

export const clientRoleRouter = router({
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
    }),
  getCurrentWarnings: protectedProcedure
    .output(WarningsResponseSchema)
    .query(opts => {
      const warningsService = new WarningsService(
        new UsersService(opts.ctx.database)
      )
      return warningsService.getWarnings(opts.ctx.user.id)
    })
})
