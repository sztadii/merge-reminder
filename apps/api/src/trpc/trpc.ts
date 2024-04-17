import { TRPCError, initTRPC } from '@trpc/server'
import { isBefore } from 'date-fns'

import { config } from '../config'
import { Context } from './create-context'

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(opts => {
  const { ctx } = opts

  const isUnderMaintenance = config.isUnderMaintenance

  if (isUnderMaintenance) {
    throw new TRPCError({ code: 'PRECONDITION_FAILED' })
  }

  const isAuthorized =
    ctx.user && isBefore(new Date(), new Date(ctx.user.expiredAt))

  if (!isAuthorized) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return opts.next({
    ctx
  })
})
