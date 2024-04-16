import { TRPCError } from '@trpc/server'

export class UnauthorizedError extends TRPCError {
  constructor() {
    super({
      code: 'UNAUTHORIZED'
    })
  }
}
