import { createExpressMiddleware } from '@trpc/server/adapters/express'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'

import { config } from './src/config'
import { initDatabase } from './src/database'
import { appRouter } from './src/routers'
import { createContext } from './src/trpc'

async function init() {
  await initDatabase(config.mongo.url)

  const app = express()

  app.use(cors())

  app.use(
    '/trpc',
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  )

  const port = config.app.port

  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`)
  })
}

init()
