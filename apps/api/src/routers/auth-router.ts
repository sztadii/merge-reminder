import {
  EmptyResponseSchema,
  LoginRequestSchema,
  LoginResponseSchema
} from '@apps/shared/schemas'

import { createAuthController } from '@apps/api/factories/create-auth-controller'
import {
  publicProcedure,
  router,
  tokenProtectedProcedure
} from '@apps/api/trpc'

export const authRouter = router({
  login: publicProcedure
    .input(LoginRequestSchema)
    .output(LoginResponseSchema)
    .mutation(opts => {
      const authController = createAuthController(opts.ctx)

      return authController.login(opts.input)
    }),
  removeCurrentAccount: tokenProtectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const authController = createAuthController(opts.ctx)

      return authController.removeAccount(opts.ctx.user.id)
    })
})
