import { UserNoRepoAccessError } from '../errors/user-errors'
import { GithubKitRepository } from '../repositories/github-kit-repository'
import { UsersRepository } from '../repositories/users-repository'
import { RepositoryResponse } from '../schemas'

export class RepositoriesController {
  constructor(
    private usersRepository: UsersRepository,
    private githubKitRepository: GithubKitRepository
  ) {}

  async getRepositories(userId: string): Promise<RepositoryResponse[]> {
    const user = await this.usersRepository.getById(userId)

    if (!user?.githubAppInstallationId) {
      throw new UserNoRepoAccessError()
    }

    const repos = await this.githubKitRepository.getInstalledRepos(
      user.githubAppInstallationId
    )

    return repos.map(repo => {
      return {
        id: repo.id,
        name: repo.name,
        url: repo.html_url
      }
    })
  }
}
