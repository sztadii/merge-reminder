import { UnexpectedError } from '@apps/api/errors/common-errors'
import { InstallationRepository } from '@apps/api/repositories/installation-repository'

export class InstallationController {
  constructor(private installationRepository: InstallationRepository) {}

  async connectRepository(
    userId: string,
    installationId: number
  ): Promise<void> {
    await this.installationRepository
      .connectRepositories(userId, installationId)
      .catch(() => {
        throw new UnexpectedError(
          'An error occurred while connecting repositories.'
        )
      })
  }

  async disconnectRepositories(userId: string): Promise<void> {
    await this.installationRepository
      .disconnectRepositories(userId)
      .catch(() => {
        throw new UnexpectedError(
          'An error occurred while disconnecting repositories.'
        )
      })
  }
}
