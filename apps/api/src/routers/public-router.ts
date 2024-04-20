import { WarningsController } from '../controllers/warnings-controller'
import { ReposConfigurationsRepository } from '../repositories/repos-configurations-repository'
import { UsersRepository } from '../repositories/users-repository'
import { EmptyResponseSchema } from '../schemas'
import { EmailService } from '../services/email-service'
import { apiKeyProtectedProcedure, router } from '../trpc'

export const publicRouter = router({
  sendWarningsForAllUsers: apiKeyProtectedProcedure
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const usersRepository = new UsersRepository(opts.ctx.database)
      const emailService = new EmailService()
      const reposConfigurationsRepository = new ReposConfigurationsRepository(
        opts.ctx.database
      )
      const warningsController = new WarningsController(
        usersRepository,
        reposConfigurationsRepository,
        emailService
      )

      return warningsController.sendWarningsForAllUsers()
    })
})
