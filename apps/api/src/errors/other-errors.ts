import { TRPCError } from '@trpc/server'

export class UnderMaintenanceError extends TRPCError {
  constructor() {
    super({
      code: 'PRECONDITION_FAILED',
      message: 'Server under maintenance.'
    })
  }
}

export class MissingBranchError extends Error {}
