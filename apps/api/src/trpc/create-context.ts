import * as trpcExpress from '@trpc/server/adapters/express'

import { getDatabase } from '../database'
import { convertTokenToJSON } from '../helpers'
import { UserFromToken } from '../types'

export function createContext(opts: trpcExpress.CreateExpressContextOptions) {
  const token = (opts.req.headers.authorization || '').split('Bearer ')[1]
  const user = convertTokenToJSON<UserFromToken>(token)!
  const database = getDatabase()
  const apiKey = opts.req.headers['api-key']

  return {
    database,
    user,
    apiKey
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
