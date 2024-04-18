import { router } from '../trpc'
import { authRouter } from './auth-router'
import { clientRouter } from './client-router'
import { publicRouter } from './public-router'

export const appRouter = router({
  client: clientRouter,
  auth: authRouter,
  public: publicRouter
})
