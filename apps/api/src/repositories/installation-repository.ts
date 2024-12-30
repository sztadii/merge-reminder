import { GithubAppRepository } from './github-app-repository'
import { ReposConfigurationsRepository } from './repos-configurations-repository'
import { UsersRepository } from './users-repository'

export class InstallationRepository {
  constructor(
    private usersRepository: UsersRepository,
    private githubAppRepository: GithubAppRepository,
    private reposConfigurationsRepository: ReposConfigurationsRepository
  ) {}

  async connectRepositories(
    userId: string,
    installationId: number
  ): Promise<void> {
    await this.usersRepository.updateById(userId, {
      githubAppInstallationId: installationId
    })
    await this.reposConfigurationsRepository.create({
      userId,
      headBranch: 'main',
      baseBranch: 'develop',
      excludeReposWithoutRequiredBranches: false,
      repos: []
    })
  }

  async disconnectRepositories(userId: string): Promise<void> {
    const user = await this.usersRepository.getById(userId)

    if (user?.githubAppInstallationId) {
      await this.githubAppRepository.deleteApp(user.githubAppInstallationId)
    }

    await this.usersRepository.updateById(userId, {
      githubAppInstallationId: null
    })

    await this.reposConfigurationsRepository.deleteByUserId(userId)
  }
}
