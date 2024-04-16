import { TRPCError } from '@trpc/server'

import { InstallationRepository } from '../repositories/installation-repository'

export class InstallationController {
  constructor(private installationRepository: InstallationRepository) {}

  async connectRepository(userId: string, installationId: number) {
    await this.installationRepository
      .connectRepositories(userId, installationId)
      .catch(() => {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while connecting repositories.'
        })
      })
  }

  async disconnectRepositories(userId: string) {
    await this.installationRepository
      .disconnectRepositories(userId)
      .catch(() => {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while disconnecting repositories.'
        })
      })
  }
}
