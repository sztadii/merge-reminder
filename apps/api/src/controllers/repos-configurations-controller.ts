import { TRPCError } from '@trpc/server'

import { ReposConfigurationRecord } from '../database'
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
    const record = await this.reposConfigurationsRepository
      .getByUserId(id)
      .catch(() => {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while getting the configuration.'
        })
      })

    if (!record) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `The configuration not found.`
      })
    }

    return this.mapRecordToResponse(record)
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
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while updating the repo configuration.'
      })
    }
  }

  protected mapRecordToResponse(
    configuration: ReposConfigurationRecord
  ): RepoConfigurationResponse {
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
}
