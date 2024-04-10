import { WarningsSchema } from '../schemas'
import { UsersService } from '../services/users-service'
import { WarningsService } from '../services/warnings-service'
import { protectedProcedure, router } from '../trpc'

export const warningsRouter = router({
  getCurrentWarnings: protectedProcedure.output(WarningsSchema).query(opts => {
    const warningsService = new WarningsService(
      new UsersService(opts.ctx.database)
    )
    return warningsService.getWarnings(opts.ctx.user.id)
  })
})
