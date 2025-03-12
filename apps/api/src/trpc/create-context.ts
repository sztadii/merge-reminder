import * as trpcExpress from '@trpc/server/adapters/express'

import { getDatabase } from '@apps/api/database'
import { convertTokenToJSON } from '@apps/api/helpers'
import { Logger } from '@apps/api/logger'
import { UserFromToken } from '@apps/api/types'

export function createContext(opts: trpcExpress.CreateExpressContextOptions) {
  const token = opts.req.headers.authorization || ''
  const user = convertTokenToJSON<UserFromToken>(token)!
  const database = getDatabase()
  const logger = new Logger()
  const apiKey = opts.req.headers['api-key']

  return {
    database,
    user,
    apiKey,
    logger
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
