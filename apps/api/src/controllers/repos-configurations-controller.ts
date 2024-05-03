import { UnexpectedError } from '../errors/common-errors'
import { ConfigurationNotFoundError } from '../errors/repos-errors'
import { ReposConfigurationsRepository } from '../repositories/repos-configurations-repository'
import {
  RepoConfigurationResponse,
  RepoConfigurationUpdateRequest
} from '../schemas'

export class ReposConfigurationsController {
  constructor(
    private reposConfigurationsRepository: ReposConfigurationsRepository
  ) {}

  async getByUserId(id: string): Promise<RepoConfigurationResponse> {
    const configuration = await this.reposConfigurationsRepository
      .getByUserId(id)
      .catch(() => {
        throw new UnexpectedError(
          'An error occurred while getting the configuration.'
        )
      })

    if (!configuration) {
      throw new ConfigurationNotFoundError()
    }

    return {
      id: configuration._id.toString(),
      userId: configuration.userId,
      headBranch: configuration.headBranch,
      baseBranch: configuration.baseBranch,
      excludeReposWithoutRequiredBranches:
        configuration.excludeReposWithoutRequiredBranches,
      repos: configuration.repos
    }
  }

  async updateByUserId(
    userId: string,
    configurationData: RepoConfigurationUpdateRequest
  ): Promise<void> {
    try {
      await this.reposConfigurationsRepository.updateByUserId(
        userId,
        configurationData
      )
    } catch {
      throw new UnexpectedError(
        'An error occurred while updating the repo configuration.'
      )
    }
  }
}
