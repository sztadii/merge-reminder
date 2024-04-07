import { ReminderSchema, UserResponseSchema } from '../schemas'
import { RemindersService } from '../services/reminders-service'
import { UsersService } from '../services/users-service'
import { publicProcedure, router } from '../trpc'

export const remindersRouter = router({
  getReminder: publicProcedure
    .input(UserResponseSchema.shape.id)
    .output(ReminderSchema)
    .query(opts => {
      const reminderService = new RemindersService(
        new UsersService(opts.ctx.database)
      )
      return reminderService.getReminder(opts.input)
    })
})
