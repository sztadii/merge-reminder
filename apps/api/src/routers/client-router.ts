import {
  ConnectRepositoriesRequestSchema,
  EmailConfirmRequestSchema,
  EmailUpdateRequestSchema,
  EmptyResponseSchema,
  RepoConfigurationResponseSchema,
  RepoConfigurationUpdateRequestSchema,
  RepositoriesResponseSchema,
  SendEmailConfirmationRequestSchema,
  UserResponseSchema,
  WarningsResponseSchema
} from '@apps/shared/schemas'

import { createInstallationController } from '@apps/api/factories/create-installation-controller'
import { createReposConfigurationsController } from '@apps/api/factories/create-repos-configurations-controller'
import { createRepositoriesController } from '@apps/api/factories/create-repositories-controller'
import { createUsersController } from '@apps/api/factories/create-users-controller'
import { createWarningsController } from '@apps/api/factories/create-warnings-controller'
import {
  publicProcedure,
  router,
  tokenProtectedProcedure
} from '@apps/api/trpc'

export const clientRouter = router({
  getCurrentUser: tokenProtectedProcedure
    .output(UserResponseSchema)
    .query(opts => {
      const usersController = createUsersController(opts.ctx)

      return usersController.getById(opts.ctx.user.id)
    }),
  updateCurrentEmail: tokenProtectedProcedure
    .input(EmailUpdateRequestSchema)
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersController = createUsersController(opts.ctx)

      return usersController.updateEmail(opts.ctx.user.id, opts.input)
    }),
  stopDeletionProcess: tokenProtectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersController = createUsersController(opts.ctx)

      return usersController.stopDeletion(opts.ctx.user.id)
    }),
  confirmEmail: publicProcedure
    .input(EmailConfirmRequestSchema)
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersController = createUsersController(opts.ctx)

      return usersController.confirmEmail(opts.input)
    }),
  sendEmailConfirmation: tokenProtectedProcedure
    .input(SendEmailConfirmationRequestSchema)
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersController = createUsersController(opts.ctx)

      return usersController.sendEmailConfirmation(opts.ctx.user.id, opts.input)
    }),
  connectRepositories: tokenProtectedProcedure
    .input(ConnectRepositoriesRequestSchema)
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const installationController = createInstallationController(opts.ctx)

      return installationController.connectRepository(
        opts.ctx.user.id,
        opts.input.installationId
      )
    }),
  disconnectRepositories: tokenProtectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const installationController = createInstallationController(opts.ctx)

      return installationController.disconnectRepositories(opts.ctx.user.id)
    }),
  getCurrentWarnings: tokenProtectedProcedure
    .output(WarningsResponseSchema)
    .query(opts => {
      const warningsController = createWarningsController(opts.ctx)

      return warningsController.getWarnings(opts.ctx.user.id)
    }),
  sendCurrentWarnings: tokenProtectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const warningsController = createWarningsController(opts.ctx)

      return warningsController.sendWarnings(opts.ctx.user.id)
    }),
  getCurrentRepositories: tokenProtectedProcedure
    .output(RepositoriesResponseSchema)
    .query(opts => {
      const repositoriesController = createRepositoriesController(opts.ctx)

      return repositoriesController.getRepositories(opts.ctx.user.id)
    }),
  getCurrentRepositoriesConfiguration: tokenProtectedProcedure
    .output(RepoConfigurationResponseSchema)
    .query(opts => {
      const reposConfigurationsController = createReposConfigurationsController(
        opts.ctx
      )

      return reposConfigurationsController.getByUserId(opts.ctx.user.id)
    }),
  updateCurrentRepositoriesConfiguration: tokenProtectedProcedure
    .input(RepoConfigurationUpdateRequestSchema)
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const reposConfigurationsController = createReposConfigurationsController(
        opts.ctx
      )

      return reposConfigurationsController.updateByUserId(
        opts.ctx.user.id,
        opts.input
      )
    })
})
