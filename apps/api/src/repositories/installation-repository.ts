import { GithubAppRepository } from './github-app-repository'
import { ReposConfigurationsRepository } from './repos-configurations-repository'
import { UsersRepository } from './users-repository'

export class InstallationRepository {
  constructor(
    private usersRepository: UsersRepository,
    private reposConfigurationsRepository: ReposConfigurationsRepository
  ) {}

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

    await this.reposConfigurationsRepository.deleteByUserId(userId)
  }
}
