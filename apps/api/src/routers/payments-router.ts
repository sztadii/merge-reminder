import {
  EmptyResponseSchema,
  PaymentWebhookSchema,
  StringResponseSchema,
  UpdateCheckoutSessionSchema
} from '@apps/shared/schemas'

import { createPaymentsController } from '@apps/api/controllers/payments-controller/payments-controller.factory'
import {
  publicProcedure,
  router,
  tokenProtectedProcedure
} from '@apps/api/trpc'

export const paymentsRouter = router({
  webhook: publicProcedure
    .input(PaymentWebhookSchema)
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const paymentsController = createPaymentsController(opts.ctx)

      return paymentsController.handleWebhookEvents(opts.input)
    }),
  createSubscribeUrl: tokenProtectedProcedure
    .output(StringResponseSchema)
    .mutation(opts => {
      const paymentsController = createPaymentsController(opts.ctx)
      return paymentsController.createSubscribeUrl(opts.ctx.user.id)
    }),
  unsubscribe: tokenProtectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const paymentsController = createPaymentsController(opts.ctx)
      return paymentsController.unsubscribe(opts.ctx.user.id)
    }),
  updateCurrentCheckoutSessionId: tokenProtectedProcedure
    .input(UpdateCheckoutSessionSchema)
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const paymentsController = createPaymentsController(opts.ctx)
      return paymentsController.updateCheckoutSessionId(
        opts.ctx.user.id,
        opts.input
      )
    })
})
