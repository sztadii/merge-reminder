import { TRPCError } from '@trpc/server'

export class NoActiveSubscriptionError extends TRPCError {
  constructor() {
    super({
      code: 'FORBIDDEN',
      message: 'Your subscription is not active anymore.'
    })
  }
}
