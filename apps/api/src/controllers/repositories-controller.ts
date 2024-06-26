import { UserNoRepoAccessError } from '../errors/user-errors'
import { GithubAppRepository } from '../repositories/github-app-repository'
import { UsersRepository } from '../repositories/users-repository'
import { RepositoryResponse } from '../schemas'

export class RepositoriesController {
  constructor(private usersRepository: UsersRepository) {}

  async getRepositories(userId: string): Promise<RepositoryResponse[]> {
    const user = await this.usersRepository.getById(userId)

    if (!user?.githubAppInstallationId) {
      throw new UserNoRepoAccessError()
    }

    const githubAppRepository = await GithubAppRepository.build(
      user.githubAppInstallationId
    )

    const repos = await githubAppRepository.getInstalledRepos()

    return repos.map(repo => {
      return {
        id: repo.id,
        name: repo.name,
        url: repo.html_url
      }
    })
  }
}
