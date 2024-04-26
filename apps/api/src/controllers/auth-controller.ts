import { TRPCError } from '@trpc/server'
import { addHours } from 'date-fns'

import { UserDatabaseRecord } from '../database'
import { convertJSONToToken } from '../helpers'
import { GithubAuthRepository } from '../repositories/github-auth-repository'
import { InstallationRepository } from '../repositories/installation-repository'
import { ReposConfigurationsRepository } from '../repositories/repos-configurations-repository'
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
    private reposConfigurationsRepository: ReposConfigurationsRepository,
    private githubAuthRepository: GithubAuthRepository,
    private installationRepository: InstallationRepository
  ) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    const { user: githubUser, accessToken: githubAccessToken } =
      await this.githubAuthRepository.getAuthUser(request.code).catch(() => {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `An error occurred while fetching the GitHub user.`
        })
      })

    const user = await this.usersRepository
      .getByGithubId(githubUser.id)
      .catch(() => {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `An error occurred while fetching the user.`
        })
      })

    if (user) {
      await this.usersRepository.updateById(user._id.toString(), {
        githubAccessToken
      })

      const token = this.getTokenFromUser(user)

      return {
        token,
        isNewUser: false
      }
    }

    const validatedUser = await UserCreateRequestSchema.parseAsync({
      role: 'client',
      avatarUrl: githubUser.avatar_url,
      githubId: githubUser.id,
      githubAccessToken
    } as UserCreateRequest).catch(() => {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `The GitHub API sent unexpected data. Please wait, we are working on it.`
      })
    })

    const createdUser = await this.usersRepository
      .create(validatedUser)
      .catch(() => {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `An error occurred while creating the user.`
        })
      })

    if (!createdUser) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `The user not found.`
      })
    }

    const token = this.getTokenFromUser(createdUser)

    return {
      token,
      isNewUser: true
    }
  }

  async deleteCurrentUser(userId: string): Promise<void> {
    try {
      const user = await this.usersRepository.getById(userId)
      const githubAccessToken = user?.githubAccessToken

      if (!githubAccessToken) {
        throw new Error()
      }

      await Promise.all([
        this.installationRepository.disconnectRepositories(userId),
        this.usersRepository.deleteById(userId),
        this.reposConfigurationsRepository.deleteByUserId(userId),
        this.githubAuthRepository.removeAccess(githubAccessToken)
      ])
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `An error occurred while deleting the user.`
      })
    }
  }

  private getTokenFromUser(user: UserDatabaseRecord): string {
    const userFromToken: UserFromToken = {
      id: user._id.toString(),
      expiredAt: addHours(new Date(), 6).toString() // Github token expires in 8h
    }
    const token = convertJSONToToken(userFromToken)

    if (!token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: `Unauthorized to login.`
      })
    }

    return token
  }
}
