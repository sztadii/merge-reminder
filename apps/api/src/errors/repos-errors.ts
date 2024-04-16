import { TRPCError } from '@trpc/server'

export class ConfigurationNotFoundError extends TRPCError {
  constructor() {
    super({
      code: 'NOT_FOUND',
      message: 'The configuration not found.'
    })
  }
}
