import { LoginRequestSchema, LoginResponseSchema } from '../schemas'
import { AuthService } from '../services/auth-service'
import { UsersService } from '../services/users-service'
import { publicProcedure, router } from '../trpc'

export const authRouter = router({
  login: publicProcedure
    .input(LoginRequestSchema)
    .output(LoginResponseSchema)
    .mutation(opts => {
      const authService = new AuthService(new UsersService(opts.ctx.database))
      return authService.login(opts.input)
    })
})
