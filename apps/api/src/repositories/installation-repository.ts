import { GithubAppRepository } from './github-app-repository'
import { UsersRepository } from './users-repository'

export class InstallationRepository {
  constructor(private usersRepository: UsersRepository) {}

  async connectRepositories(
    userId: string,
    installationId: number
  ): Promise<void> {
    await this.usersRepository.updateById(userId, {
      githubAppInstallationId: installationId
    })
  }

  async disconnectRepositories(userId: string): Promise<void> {
    const user = await this.usersRepository.getById(userId)

    if (user?.githubAppInstallationId) {
      const githubAppRepository = await GithubAppRepository.build(
        user.githubAppInstallationId
      )
      await githubAppRepository.deleteApp()
    }

    await this.usersRepository.updateById(userId, {
      githubAppInstallationId: null
    })

    // TODO Remove repo configuration
  }
}
