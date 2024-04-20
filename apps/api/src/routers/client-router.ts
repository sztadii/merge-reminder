import { AuthController } from '../controllers/auth-controller'
import { InstallationController } from '../controllers/installation-controller'
import { RepositoriesController } from '../controllers/repositories-controller'
import { UsersController } from '../controllers/users-controller'
import { WarningsController } from '../controllers/warnings-controller'
import { GithubAuthRepository } from '../repositories/github-auth-repository'
import { InstallationRepository } from '../repositories/installation-repository'
import { UsersRepository } from '../repositories/users-repository'
import {
  ConnectRepositoriesRequestSchema,
  EmptyResponseSchema,
  RepositoriesResponseSchema,
  UserResponseSchema,
  UserUpdateRequestSchema,
  WarningsResponseSchema
} from '../schemas'
import { EmailService } from '../services/email-service'
import { router, tokenProtectedProcedure } from '../trpc'

export const clientRouter = router({
  getCurrentUser: tokenProtectedProcedure
    .output(UserResponseSchema)
    .query(opts => {
      const usersRepository = new UsersRepository(opts.ctx.database)
      const usersController = new UsersController(usersRepository)

      return usersController.getById(opts.ctx.user.id)
    }),
  updateCurrentUser: tokenProtectedProcedure
    .input(UserUpdateRequestSchema)
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersRepository = new UsersRepository(opts.ctx.database)
      const usersController = new UsersController(usersRepository)

      return usersController.updateById(opts.ctx.user.id, opts.input)
    }),
  connectRepositories: tokenProtectedProcedure
    .input(ConnectRepositoriesRequestSchema)
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersRepository = new UsersRepository(opts.ctx.database)
      const installationRepository = new InstallationRepository(usersRepository)
      const installationController = new InstallationController(
        installationRepository
      )

      return installationController.connectRepository(
        opts.ctx.user.id,
        opts.input.installationId
      )
    }),
  disconnectRepositories: tokenProtectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersRepository = new UsersRepository(opts.ctx.database)
      const installationRepository = new InstallationRepository(usersRepository)
      const installationController = new InstallationController(
        installationRepository
      )

      return installationController.disconnectRepositories(opts.ctx.user.id)
    }),
  getCurrentWarnings: tokenProtectedProcedure
    .output(WarningsResponseSchema)
    .query(opts => {
      const usersRepository = new UsersRepository(opts.ctx.database)
      const emailService = new EmailService()
      const warningsController = new WarningsController(
        usersRepository,
        emailService
      )

      return warningsController.getWarnings(opts.ctx.user.id)
    }),
  sendCurrentWarnings: tokenProtectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersRepository = new UsersRepository(opts.ctx.database)
      const emailService = new EmailService()
      const warningsController = new WarningsController(
        usersRepository,
        emailService
      )

      return warningsController.sendWarnings(opts.ctx.user.id)
    }),
  removeCurrentAccount: tokenProtectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersRepository = new UsersRepository(opts.ctx.database)
      const installationRepository = new InstallationRepository(usersRepository)
      const githubAuthRepository = new GithubAuthRepository()
      const authController = new AuthController(
        usersRepository,
        githubAuthRepository,
        installationRepository
      )

      return authController.deleteCurrentUser(opts.ctx.user.id)
    }),
  getCurrentRepositories: tokenProtectedProcedure
    .output(RepositoriesResponseSchema)
    .query(opts => {
      const usersRepository = new UsersRepository(opts.ctx.database)
      const warningsController = new RepositoriesController(usersRepository)

      return warningsController.getRepositories(opts.ctx.user.id)
    })
})
