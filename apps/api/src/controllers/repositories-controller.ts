import { UserNoRepoAccessError } from '../errors/user-errors'
import { GithubAppRepository } from '../repositories/github-app-repository'
import { UsersRepository } from '../repositories/users-repository'
import { RepositoryResponse } from '../schemas'

export class RepositoriesController {
  constructor(
    private usersRepository: UsersRepository,
    private githubAppRepository: GithubAppRepository
  ) {}

  async getRepositories(userId: string): Promise<RepositoryResponse[]> {
    const user = await this.usersRepository.getById(userId)

    if (!user?.githubAppInstallationId) {
      throw new UserNoRepoAccessError()
    }

    const repos = await this.githubAppRepository.getInstalledRepos(
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
