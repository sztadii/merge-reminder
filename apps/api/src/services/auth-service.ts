import { TRPCError } from '@trpc/server'
import { addHours } from 'date-fns'

import { convertJSONToToken } from '../helpers'
import {
  LoginRequest,
  LoginResponse,
  UserCreateRequest,
  UserCreateRequestSchema,
  UserResponse
} from '../schemas'
import { UserFromToken } from '../types'
import { GithubAppService } from './github-app-service'
import { GithubAuthService } from './github-auth-service'
import { UsersService } from './users-service'

export class AuthService {
  constructor(private userService: UsersService) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    const githubAuthService = new GithubAuthService()

    const githubUser = await githubAuthService
      .getAuthUser(request.code)
      .catch(() => {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `An error occurred while fetching the GitHub user.`
        })
      })

    const user = await this.userService
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

      const createdUser = await this.userService
        .create(validatedUser)
        .catch(() => {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `An error occurred while creating the user.`
          })
        })

      return this.getTokenFromUser(createdUser)
    }

    return this.getTokenFromUser(user)
  }

  async deleteCurrentUser(userId: string) {
    const user = await this.userService.getByIdWithSensitiveData(userId)

    if (user.githubAppInstallationId) {
      const githubAppService = await GithubAppService.build(
        user.githubAppInstallationId
      )
      await githubAppService.deleteApp()
    }

    await this.userService.deleteById(userId)
  }

  private getTokenFromUser(user: UserResponse): LoginResponse {
    const userFromToken: UserFromToken = {
      id: user.id,
      expiredAt: addHours(new Date(), 6).toString() // Github token expires in 8h
    }
    const token = convertJSONToToken(userFromToken)!

    return {
      token
    }
  }
}
