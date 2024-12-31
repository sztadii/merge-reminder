import { addHours } from 'date-fns'

import {
  LoginRequest,
  LoginResponse,
  UserCreateRequest,
  UserCreateRequestSchema
} from '@apps/shared/schemas'

import { UserDatabaseRecord } from '@apps/api/database'
import { UnauthorizedError } from '@apps/api/errors/auth-errors'
import { UnexpectedError } from '@apps/api/errors/common-errors'
import {
  UserMissingAccessTokenError,
  UserNotFoundError
} from '@apps/api/errors/user-errors'
import { convertJSONToToken } from '@apps/api/helpers'
import { GithubAuthRepository } from '@apps/api/repositories/github-auth-repository'
import { InstallationRepository } from '@apps/api/repositories/installation-repository'
import { PaymentsRepository } from '@apps/api/repositories/payments-repository'
import { ReposConfigurationsRepository } from '@apps/api/repositories/repos-configurations-repository'
import { UsersRepository } from '@apps/api/repositories/users-repository'
import { UserFromToken } from '@apps/api/types'

export class AuthController {
  constructor(
    private usersRepository: UsersRepository,
    private reposConfigurationsRepository: ReposConfigurationsRepository,
    private githubAuthRepository: GithubAuthRepository,
    private installationRepository: InstallationRepository,
    private paymentsRepository: PaymentsRepository
  ) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    const { user: githubUser, accessToken: githubAccessToken } =
      await this.githubAuthRepository.getAuthUser(request.code).catch(() => {
        throw new UnexpectedError(
          'An error occurred while fetching the GitHub user.'
        )
      })

    const user = await this.usersRepository
      .getByGithubId(githubUser.id)
      .catch(() => {
        throw new UnexpectedError('An error occurred while fetching the user.')
      })

    if (user) {
      await this.usersRepository.updateById(user._id.toString(), {
        githubAccessToken
      })

      const token = this.getTokenFromUser(user)

      return {
        token,
        isNewUser: false,
        isDeletedUser: !!user.deletedDate
      }
    }

    const validatedUser = await UserCreateRequestSchema.parseAsync({
      role: 'client',
      avatarUrl: githubUser.avatar_url,
      githubId: githubUser.id,
      githubLogin: githubUser.login,
      githubAccessToken
    } as UserCreateRequest).catch(() => {
      throw new UnexpectedError(
        'The GitHub API sent unexpected data. Please wait, we are working on it.'
      )
    })

    const createdUser = await this.usersRepository
      .create(validatedUser)
      .catch(() => {
        throw new UnexpectedError('An error occurred while creating the user.')
      })

    const token = this.getTokenFromUser(createdUser)

    return {
      token,
      isNewUser: true,
      isDeletedUser: false
    }
  }

  async removeAccount(userId: string): Promise<void> {
    const user = await this.usersRepository.getById(userId).catch(() => {
      throw new UnexpectedError()
    })
    if (!user) throw new UserNotFoundError()

    const githubAccessToken = user.githubAccessToken
    if (!githubAccessToken) throw new UserMissingAccessTokenError()

    try {
      await this.paymentsRepository.unsubscribe(userId)
      await this.installationRepository.disconnectRepositories(userId)
      await this.githubAuthRepository.removeAccess(githubAccessToken)
      await this.reposConfigurationsRepository.deleteByUserId(userId)
      await this.usersRepository.deleteById(userId)
    } catch {
      throw new UnexpectedError('An error occurred while deleting the user.')
    }
  }

  private getTokenFromUser(user: UserDatabaseRecord): string {
    const userFromToken: UserFromToken = {
      id: user._id.toString(),
      expiredAt: addHours(new Date(), 6).toString() // Github token expires in 8h
    }
    const token = convertJSONToToken(userFromToken)

    if (!token) {
      throw new UnauthorizedError()
    }

    return token
  }
}
