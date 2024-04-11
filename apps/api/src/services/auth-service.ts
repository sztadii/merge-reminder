import { TRPCError } from '@trpc/server'
import axios from 'axios'
import { addHours } from 'date-fns'

import { config } from '../config'
import { convertJSONToToken } from '../helpers'
import { LoginRequest, LoginResponse, UserResponse } from '../schemas'
import { UserFromToken } from '../types'
import { GithubService } from './github-service'
import { UsersService } from './users-service'

export class AuthService {
  constructor(private userService: UsersService) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const params = `?client_id=${config.github.clientId}&client_secret=${config.github.secret}&code=${request.code}`

      const accessTokenResponse = await axios.post(
        `https://github.com/login/oauth/access_token${params}`,
        null,
        {
          headers: {
            accept: 'application/json'
          }
        }
      )

      const githubService = new GithubService(
        accessTokenResponse.data.access_token
      )
      const githubUserResponse = await githubService.users.getAuthenticated()
      const githubUser = githubUserResponse.data

      const user = await this.userService
        .getByGithubId(githubUser.id)
        .catch(() => undefined)

      if (!user) {
        const createdUser = await this.userService.create({
          githubId: githubUser.id,
          userOrOrganizationName: githubUser.login,
          headBranch: 'main',
          baseBranch: 'develop',
          isOrganization: true
        })
        return this.getTokenFromUser(createdUser)
      }

      return this.getTokenFromUser(user)
    } catch (e) {
      const error = e as Error

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message
      })
    }
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
