import { TRPCError } from '@trpc/server'
import { addHours } from 'date-fns'

import { UserDatabaseRecord } from '../database'
import { convertJSONToToken } from '../helpers'
import { GithubAuthRepository } from '../repositories/github-auth-repository'
import { InstallationRepository } from '../repositories/installation-repository'
import { UsersRepository } from '../repositories/users-repository'
import {
  LoginRequest,
  LoginResponse,
  UserCreateRequest,
  UserCreateRequestSchema
} from '../schemas'
import { UserFromToken } from '../types'

export class AuthController {
  constructor(
    private usersRepository: UsersRepository,
    private githubAuthRepository: GithubAuthRepository,
    private installationRepository: InstallationRepository
  ) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    const githubUser = await this.githubAuthRepository
      .getAuthUser(request.code)
      .catch(() => {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `An error occurred while fetching the GitHub user.`
        })
      })

    const user = await this.usersRepository
      .getByGithubId(githubUser.id)
      .catch(e => {
        const error = e as TRPCError
        if (error.code === 'NOT_FOUND') {
          return undefined
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `An error occurred while fetching the user.`
        })
      })

    if (!user) {
      const validatedUser = await UserCreateRequestSchema.parseAsync({
        role: 'client',
        avatarUrl: githubUser.avatar_url,
        githubId: githubUser.id,
        headBranch: 'main',
        baseBranch: 'develop'
      } as UserCreateRequest).catch(() => {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `The GitHub API sent unexpected data. Please wait, we are working on fixing it soon.`
        })
      })

      const createdUserId = await this.usersRepository
        .create(validatedUser)
        .catch(() => {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `An error occurred while creating the user.`
          })
        })

      const createdUser = await this.usersRepository.getById(createdUserId)

      if (!createdUser) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `An error occurred while getting the user.`
        })
      }

      return this.getTokenFromUser(createdUser)
    }

    return this.getTokenFromUser(user)
  }

  async deleteCurrentUser(userId: string) {
    try {
      await this.installationRepository.disconnectRepositories(userId)
      await this.usersRepository.deleteById(userId)
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `An error occurred while deleting the user.`
      })
    }
  }

  private getTokenFromUser(user: UserDatabaseRecord): LoginResponse {
    const userFromToken: UserFromToken = {
      id: user._id.toString(),
      expiredAt: addHours(new Date(), 6).toString() // Github token expires in 8h
    }
    const token = convertJSONToToken(userFromToken)!

    return {
      token
    }
  }
}
