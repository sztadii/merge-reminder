import { TRPCError } from '@trpc/server'

import { UserDatabaseRecord } from '../database'
import { UsersRepository } from '../repositories/users-repository'
import { EmailUpdateRequest, UserResponse } from '../schemas'

export class UsersController {
  constructor(private usersRepository: UsersRepository) {}

  async getById(id: string): Promise<UserResponse> {
    const record = await this.usersRepository.getById(id).catch(() => {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while getting the user.'
      })
    })

    if (!record) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `The user not found.`
      })
    }

    return this.mapRecordToResponse(record)
  }

  async updateEmail(id: string, userData: EmailUpdateRequest): Promise<void> {
    try {
      await this.usersRepository.updateById(id, {
        email: userData.email
      })
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while updating the user.'
      })
    }
  }

  protected mapRecordToResponse(user: UserDatabaseRecord): UserResponse {
    return {
      id: user._id.toString(),
      avatarUrl: user.avatarUrl,
      email: user.email,
      hasInstallationId: !!user.githubAppInstallationId
    }
  }
}
