import * as trpcExpress from '@trpc/server/adapters/express'

import { getDatabase } from '../database'
import { convertTokenToJSON } from '../helpers'

export function createContext(opts: trpcExpress.CreateExpressContextOptions) {
  const token = (opts.req.headers.authorization || '').split('Bearer ')[1]
  const user = convertTokenToJSON(token)
  const database = getDatabase()

  return {
    database,
    user
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
