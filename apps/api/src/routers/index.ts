import { router } from '../trpc'
import { projectsRouter } from './projects-router'
import { usersRouter } from './users-router'

export const appRouter = router({
  users: usersRouter,
  projects: projectsRouter
})
