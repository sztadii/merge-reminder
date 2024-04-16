import { TRPCError } from '@trpc/server'

export class UnexpectedError extends TRPCError {
  constructor(message?: string) {
    super({
      code: 'INTERNAL_SERVER_ERROR',
      message: message || 'Something went wrong.'
    })
  }
}
