import {
  EmptyResponseSchema,
  LoginRequestSchema,
  LoginResponseSchema
} from '../schemas'
import { AuthService } from '../services/auth-service'
import { EmailService } from '../services/email-service'
import { UsersService } from '../services/users-service'
import { WarningsService } from '../services/warnings-service'
import { publicProcedure, router } from '../trpc'

export const publicRouter = router({
  login: publicProcedure
    .input(LoginRequestSchema)
    .output(LoginResponseSchema)
    .mutation(opts => {
      const authService = new AuthService(new UsersService(opts.ctx.database))
      return authService.login(opts.input)
    }),
  sendWarningsForAllUsers: publicProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const warningsService = new WarningsService(
        new UsersService(opts.ctx.database),
        new EmailService()
      )
      return warningsService.sendWarningsForAllUsers()
    })
})
