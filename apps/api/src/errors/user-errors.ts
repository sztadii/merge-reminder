import { TRPCError } from '@trpc/server'

export class NoActiveSubscriptionError extends TRPCError {
  constructor() {
    super({
      code: 'FORBIDDEN',
      message: 'Your subscription is not active anymore.'
    })
  }
}

export class UserNotFoundError extends TRPCError {
  constructor() {
    super({
      code: 'NOT_FOUND',
      message: 'The user not found.'
    })
  }
}

export class UserNoRepoAccessError extends TRPCError {
  constructor() {
    super({
      code: 'FORBIDDEN',
      message: 'The user has not given access to his repositories yet.'
    })
  }
}

export class UserMissingAccessTokenError extends TRPCError {
  constructor() {
    super({
      code: 'FORBIDDEN',
      message: 'Missing access token.'
    })
  }
}

export class WrongUserTokenError extends TRPCError {
  constructor() {
    super({
      code: 'BAD_REQUEST',
      message: 'The token is incorrect.'
    })
  }
}
