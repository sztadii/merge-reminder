import { router } from '../trpc'
import { remindersRouter } from './reminders-router'
import { usersRouter } from './users-router'

export const appRouter = router({
  users: usersRouter,
  reminders: remindersRouter
})
