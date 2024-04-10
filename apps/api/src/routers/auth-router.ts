import { LoginRequestSchema, LoginResponseSchema } from '../schemas'
import { AuthService } from '../services/auth-service'
import { publicProcedure, router } from '../trpc'

export const authRouter = router({
  login: publicProcedure
    .input(LoginRequestSchema)
    .output(LoginResponseSchema)
    .mutation(opts => {
      const authService = new AuthService()
      return authService.login(opts.input)
    })
})
