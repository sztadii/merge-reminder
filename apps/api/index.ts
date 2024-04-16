import { createExpressMiddleware } from '@trpc/server/adapters/express'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'

import { initDatabase } from './src/database'
import { appRouter } from './src/routers'
import { createContext } from './src/trpc'

async function init() {
  await initDatabase(process.env.MONGO_URL)

  const app = express()

  app.use(cors())

  app.use(
    '/trpc',
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  )

  const port = process.env.PORT || 3000

  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`)
  })
}

init()

export type AppRouter = typeof appRouter
