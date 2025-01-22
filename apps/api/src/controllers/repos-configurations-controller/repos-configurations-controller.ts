import {
  RepoConfigurationResponse,
  RepoConfigurationUpdateRequest
} from '@apps/shared/schemas'

import { UnexpectedError } from '@apps/api/errors/common-errors'
import { ConfigurationNotFoundError } from '@apps/api/errors/repos-errors'
import { ReposConfigurationsRepository } from '@apps/api/repositories/repos-configurations-repository'

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
