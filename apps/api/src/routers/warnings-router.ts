import { UserResponseSchema, WarningsSchema } from '../schemas'
import { UsersService } from '../services/users-service'
import { WarningsService } from '../services/warnings-service'
import { publicProcedure, router } from '../trpc'

export const warningsRouter = router({
  getWarnings: publicProcedure
    .input(UserResponseSchema.shape.id)
    .output(WarningsSchema)
    .query(opts => {
      const warningsService = new WarningsService(
        new UsersService(opts.ctx.database)
      )
      return warningsService.getWarnings(opts.input)
    })
})
