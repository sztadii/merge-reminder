import { router } from '../trpc'
import { usersRouter } from './users-router'

export const appRouter = router({
  users: usersRouter
})
