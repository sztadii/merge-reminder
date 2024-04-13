import { router } from '../trpc'
import { clientRouter } from './client-router'
import { publicRouter } from './public-router'

export const appRouter = router({
  client: clientRouter,
  public: publicRouter
})
