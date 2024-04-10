import { router } from '../trpc'
import { authRouter } from './auth-router'
import { usersRouter } from './users-router'
import { warningsRouter } from './warnings-router'

export const appRouter = router({
  users: usersRouter,
  warnings: warningsRouter,
  auth: authRouter
})
