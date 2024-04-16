import { TRPCError } from '@trpc/server'

import { UserDatabaseRecord } from '../database'
import { UsersRepository } from '../repositories/users-repository'
import { UserResponse, UserUpdateRequest } from '../schemas'

export class UsersController {
  constructor(private usersRepository: UsersRepository) {}

  async getById(id: string): Promise<UserResponse> {
    let record

    try {
      record = await this.usersRepository.getById(id)
    } catch {}

    if (!record) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `The user with ID ${id} has been deleted.`
      })
    }

    return this.mapRecordToResponse(record)
  }

  async updateById(id: string, userData: UserUpdateRequest): Promise<void> {
    try {
      await this.usersRepository.updateById(id, {
        headBranch: userData.headBranch,
        baseBranch: userData.baseBranch,
        email: userData.email,
        excludeReposWithoutRequiredBranches:
          userData.excludeReposWithoutRequiredBranches
      })
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong during user update.'
      })
    }
  }

  protected mapRecordToResponse(user: UserDatabaseRecord): UserResponse {
    return {
      id: user._id.toString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
      avatarUrl: user.avatarUrl,
      email: user.email,
      headBranch: user.headBranch,
      baseBranch: user.baseBranch,
      hasInstallationId: !!user.githubAppInstallationId,
      excludeReposWithoutRequiredBranches:
        !!user.excludeReposWithoutRequiredBranches
    }
  }
}
