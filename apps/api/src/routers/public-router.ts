import { createWarningsController } from '../factories/create-warnings-controller'
import { EmptyResponseSchema } from '../schemas'
import { apiKeyProtectedProcedure, router } from '../trpc'

export const publicRouter = router({
  sendWarningsForAllUsers: apiKeyProtectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const warningsController = createWarningsController(opts.ctx)

      return warningsController.sendWarningsForAllUsers()
    })
})
