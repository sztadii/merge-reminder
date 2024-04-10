import { createExpressMiddleware } from '@trpc/server/adapters/express'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'

import { initDatabase } from './src/database'
import { appRouter } from './src/routers'
import { createContext } from './src/trpc/create-context'

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

  app.get('/login', (req, res) => {
    const { code } = req.query
    const params = `?client_id=1bf5c9f2d119138043ab`
    return 'dupa'
  })

  const port = process.env.PORT || 3000

  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`)
  })
}

init()

export type AppRouter = typeof appRouter
