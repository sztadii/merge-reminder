import { router } from '@apps/api/trpc'

import { authRouter } from './auth-router'
import { clientRouter } from './client-router'
import { paymentsRouter } from './payments-router'
import { publicRouter } from './public-router'

export const appRouter = router({
  client: clientRouter,
  auth: authRouter,
  public: publicRouter,
  payments: paymentsRouter
})

export type AppRouter = typeof appRouter
