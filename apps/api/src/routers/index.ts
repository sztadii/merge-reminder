import { router } from '../trpc'
import { authRouter } from './auth-router'
import { clientRoleRouter } from './client-role-router'

export const appRouter = router({
  clientRole: clientRoleRouter,
  auth: authRouter
})
