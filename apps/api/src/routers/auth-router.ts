import { createAuthController } from '../factories/create-auth-controller'
import { LoginRequestSchema, LoginResponseSchema } from '../schemas'
import { publicProcedure, router } from '../trpc'

export const authRouter = router({
  login: publicProcedure
    .input(LoginRequestSchema)
    .output(LoginResponseSchema)
    .mutation(opts => {
      const authController = createAuthController(opts.ctx)

      return authController.login(opts.input)
    })
})
