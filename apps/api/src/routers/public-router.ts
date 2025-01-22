import { EmptyResponseSchema } from '@apps/shared/schemas'

import { createWarningsController } from '@apps/api/controllers/warnings-controller/warnings-controller.factory'
import { apiKeyProtectedProcedure, router } from '@apps/api/trpc'

export const publicRouter = router({
  sendWarningsForAllUsers: apiKeyProtectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const warningsController = createWarningsController(opts.ctx)

      return warningsController.sendWarningsForAllUsers()
    })
})
