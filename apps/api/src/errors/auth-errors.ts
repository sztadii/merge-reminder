import { TRPCError } from '@trpc/server'

export class UnauthorizedError extends TRPCError {
  constructor(message?: string) {
    super({
      code: 'UNAUTHORIZED',
      message
    })
  }
}
