import { AuthController } from '../controllers/auth-controller'
import { InstallationController } from '../controllers/installation-controller'
import { UsersController } from '../controllers/users-controller'
import { WarningsController } from '../controllers/warnings-controller'
import { GithubAuthRepository } from '../repositories/github-auth-repository'
import { InstallationRepository } from '../repositories/installation-repository'
import { UsersRepository } from '../repositories/users-repository'
import {
  EmptyResponseSchema,
  InstallationIdUpdateRequestSchema,
  UserResponseSchema,
  UserUpdateRequestSchema,
  WarningsResponseSchema
} from '../schemas'
import { EmailService } from '../services/email-service'
import { protectedProcedure, router } from '../trpc'

export const clientRouter = router({
  getCurrentUser: protectedProcedure.output(UserResponseSchema).query(opts => {
    const usersRepository = new UsersRepository(opts.ctx.database)
    const usersController = new UsersController(usersRepository)

    return usersController.getById(opts.ctx.user.id)
  }),
  updateCurrentUser: protectedProcedure
    .input(UserUpdateRequestSchema)
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersRepository = new UsersRepository(opts.ctx.database)
      const usersController = new UsersController(usersRepository)

      return usersController.updateById(opts.ctx.user.id, opts.input)
    }),
  updateInstallationId: protectedProcedure
    .input(InstallationIdUpdateRequestSchema)
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
  getCurrentWarnings: protectedProcedure
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
  sendCurrentWarnings: protectedProcedure
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
  removeCurrentAccount: protectedProcedure
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
  disconnectRepositories: protectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersRepository = new UsersRepository(opts.ctx.database)
      const installationRepository = new InstallationRepository(usersRepository)
      const installationController = new InstallationController(
        installationRepository
      )

      return installationController.disconnectRepositories(opts.ctx.user.id)
    })
})
