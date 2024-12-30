import { createAuthController } from '../factories/create-auth-controller'
import {
  EmptyResponseSchema,
  LoginRequestSchema,
  LoginResponseSchema
} from '../schemas'
import { publicProcedure, router, tokenProtectedProcedure } from '../trpc'

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
