import { initTRPC } from '@trpc/server'
import { isBefore } from 'date-fns'

import { config } from '@apps/api/config'
import { UnauthorizedError } from '@apps/api/errors/auth-errors'
import { UnderMaintenanceError } from '@apps/api/errors/other-errors'

import { Context } from './create-context'

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

export const apiKeyProtectedProcedure = t.procedure.use(opts => {
  const { ctx } = opts

  throwIfUnderMaintenance()

  const isAuthorized = ctx.apiKey === config.app.apiKeyForPublicEndpoints

  if (!isAuthorized) {
    throw new UnauthorizedError()
  }

  return opts.next({ ctx })
})

export const tokenProtectedProcedure = t.procedure.use(opts => {
  const { ctx } = opts

  throwIfUnderMaintenance()

  const isAuthorized =
    ctx.user && isBefore(new Date(), new Date(ctx.user.expiredAt))

  if (!isAuthorized) {
    throw new UnauthorizedError()
  }

  return opts.next({ ctx })
})

function throwIfUnderMaintenance() {
  const { isUnderMaintenance } = config.app

  if (isUnderMaintenance) {
    throw new UnderMaintenanceError()
  }
}
