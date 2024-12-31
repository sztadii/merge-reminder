import { EmptyResponseSchema } from '@apps/shared/schemas'

import { createWarningsController } from '@apps/api/factories/create-warnings-controller'
import { apiKeyProtectedProcedure, router } from '@apps/api/trpc'

export const publicRouter = router({
  sendWarningsForAllUsers: apiKeyProtectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const warningsController = createWarningsController(opts.ctx)

      return warningsController.sendWarningsForAllUsers()
    })
})
