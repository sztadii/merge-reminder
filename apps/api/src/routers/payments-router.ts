import { createPaymentsController } from '../factories/create-payments-controller'
import {
  EmptyResponseSchema,
  PaymentWebhookSchema,
  StringResponseSchema
} from '../schemas'
import { publicProcedure, router } from '../trpc'

export const paymentsRouter = router({
  webhook: publicProcedure
    .input(PaymentWebhookSchema)
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const paymentsController = createPaymentsController()

      return paymentsController.handleWebhookEvents(opts.input)
    }),
  createSubscribeUrl: publicProcedure
    .output(StringResponseSchema)
    .mutation(() => {
      const paymentsController = createPaymentsController()
      return paymentsController.createSubscribeUrl()
    })
})
