import { WarningsController } from '../controllers/warnings-controller'
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
      const warningsController = new WarningsController(
        usersRepository,
        emailService
      )

      return warningsController.sendWarningsForAllUsers()
    })
})
