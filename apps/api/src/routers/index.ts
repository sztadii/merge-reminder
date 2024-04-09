import { router } from '../trpc'
import { usersRouter } from './users-router'
import { warningsRouter } from './warnings-router'

export const appRouter = router({
  users: usersRouter,
  warnings: warningsRouter
})
