import {
  EmptyResponseSchema,
  UserRequestSchema,
  UserResponseSchema,
  UsersListResponseSchema
} from '../schemas'
import { UsersService } from '../services/users-service'
import { publicProcedure, router } from '../trpc'

export const usersRouter = router({
  findAll: publicProcedure.output(UsersListResponseSchema).query(opts => {
    const usersService = new UsersService(opts.ctx.database)
    return usersService.findAll()
  }),
  getById: publicProcedure
    .input(UserResponseSchema.shape.id)
    .output(UserResponseSchema.nullable())
    .query(opts => {
      const usersService = new UsersService(opts.ctx.database)
      return usersService.getById(opts.input)
    }),
  create: publicProcedure
    .input(UserRequestSchema)
    .output(UserResponseSchema)
    .mutation(opts => {
      const usersService = new UsersService(opts.ctx.database)
      return usersService.create(opts.input)
    }),
  deleteById: publicProcedure
    .input(UserResponseSchema.shape.id)
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersService = new UsersService(opts.ctx.database)
      return usersService.deleteById(opts.input)
    })
})
