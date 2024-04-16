import {
  EmptyResponseSchema,
  InstallationIdUpdateRequestSchema,
  UserResponseSchema,
  UserUpdateRequestSchema,
  WarningsResponseSchema
} from '../schemas'
import { AuthService } from '../services/auth-service'
import { EmailService } from '../services/email-service'
import { InstallationService } from '../services/installation-service'
import { UsersService } from '../services/users-service'
import { WarningsService } from '../services/warnings-service'
import { protectedProcedure, router } from '../trpc'

export const clientRouter = router({
  getCurrentUser: protectedProcedure.output(UserResponseSchema).query(opts => {
    const usersService = new UsersService(opts.ctx.database)
    return usersService.getById(opts.ctx.user.id)
  }),
  updateCurrentUser: protectedProcedure
    .input(UserUpdateRequestSchema)
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersService = new UsersService(opts.ctx.database)
      return usersService.updateById(opts.ctx.user.id, opts.input)
    }),
  updateInstallationId: protectedProcedure
    .input(InstallationIdUpdateRequestSchema)
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersService = new UsersService(opts.ctx.database)
      return usersService.updateInstallationId(
        opts.ctx.user.id,
        opts.input.installationId
      )
    }),
  getCurrentWarnings: protectedProcedure
    .output(WarningsResponseSchema)
    .query(opts => {
      const warningsService = new WarningsService(
        new UsersService(opts.ctx.database),
        new EmailService()
      )
      return warningsService.getWarnings(opts.ctx.user.id)
    }),
  sendCurrentWarnings: protectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const warningsService = new WarningsService(
        new UsersService(opts.ctx.database),
        new EmailService()
      )
      return warningsService.sendWarnings(opts.ctx.user.id)
    }),
  removeCurrentAccount: protectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersService = new UsersService(opts.ctx.database)
      const installationService = new InstallationService(usersService)
      const authService = new AuthService(usersService, installationService)
      return authService.deleteCurrentUser(opts.ctx.user.id)
    }),
  disconnectRepositories: protectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersService = new UsersService(opts.ctx.database)
      const installationService = new InstallationService(usersService)
      return installationService.disconnectRepositories(opts.ctx.user.id)
    })
})
