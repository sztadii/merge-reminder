import * as trpcExpress from '@trpc/server/adapters/express'

import { getDatabase } from '../database'

export const createContext = (
  opts: trpcExpress.CreateExpressContextOptions
) => {
  const database = getDatabase()

  return {
    database
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
