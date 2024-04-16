import { AuthController } from '../controllers/auth-controller'
import { WarningsController } from '../controllers/warnings-controller'
import { GithubAuthRepository } from '../repositories/github-auth-repository'
import { InstallationRepository } from '../repositories/installation-repository'
import { UsersRepository } from '../repositories/users-repository'
import {
  EmptyResponseSchema,
  LoginRequestSchema,
  LoginResponseSchema
} from '../schemas'
import { EmailService } from '../services/email-service'
import { publicProcedure, router } from '../trpc'

export const publicRouter = router({
  login: publicProcedure
    .input(LoginRequestSchema)
    .output(LoginResponseSchema)
    .mutation(opts => {
      const githubAuthRepository = new GithubAuthRepository()
      const usersRepository = new UsersRepository(opts.ctx.database)
      const installationRepository = new InstallationRepository(usersRepository)
      const authController = new AuthController(
        usersRepository,
        githubAuthRepository,
        installationRepository
      )

      return authController.login(opts.input)
    }),
  sendWarningsForAllUsers: publicProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersRepository = new UsersRepository(opts.ctx.database)
      const emailService = new EmailService()
      const warningsController = new WarningsController(
        usersRepository,
        emailService
      )

      return warningsController.sendWarningsForAllUsers()
    })
})
