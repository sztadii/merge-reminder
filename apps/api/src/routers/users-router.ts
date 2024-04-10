import {
  EmptyResponseSchema,
  UserCreateRequestSchema,
  UserResponseSchema,
  UserUpdateRequestSchema,
  UsersListResponseSchema
} from '../schemas'
import { UsersService } from '../services/users-service'
import { protectedProcedure, router } from '../trpc'

export const usersRouter = router({
  findAll: protectedProcedure.output(UsersListResponseSchema).query(opts => {
    const usersService = new UsersService(opts.ctx.database)
    return usersService.findAll()
  }),
  getById: protectedProcedure
    .input(UserResponseSchema.shape.id)
    .output(UserResponseSchema)
    .query(opts => {
      const usersService = new UsersService(opts.ctx.database)
      return usersService.getById(opts.input)
    }),
  create: protectedProcedure
    .input(UserCreateRequestSchema)
    .output(UserResponseSchema)
    .mutation(opts => {
      const usersService = new UsersService(opts.ctx.database)
      return usersService.create(opts.input)
    }),
  update: protectedProcedure
    .input(UserUpdateRequestSchema)
    .output(UserResponseSchema)
    .mutation(opts => {
      const usersService = new UsersService(opts.ctx.database)
      return usersService.update(opts.input)
    }),
  deleteById: protectedProcedure
    .input(UserResponseSchema.shape.id)
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersService = new UsersService(opts.ctx.database)
      return usersService.deleteById(opts.input)
    })
})
