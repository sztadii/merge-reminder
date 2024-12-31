import { RestEndpointMethodTypes } from '@octokit/rest'
import { OAuthApp, Octokit } from 'octokit'

import { config } from '@apps/api/config'

export class GithubAuthRepository {
  private oAuthApp: OAuthApp

  constructor() {
    this.oAuthApp = new OAuthApp({
      clientId: config.github.authClientId,
      clientSecret: config.github.authClientSecret
    })
  }

  async getAuthUser(code: string): Promise<AuthUser> {
    const tokenResponse = await this.oAuthApp.createToken({
      code
    })

    const accessToken = tokenResponse.authentication.token

    const octokit = new Octokit({ auth: accessToken })
    const response = await octokit.rest.users.getAuthenticated()

    return {
      user: response.data,
      accessToken
    }
  }

  async removeAccess(accessToken: string): Promise<void> {
    await this.oAuthApp.deleteAuthorization({
      token: accessToken
    })
  }
}

type AuthUser = {
  user: RestEndpointMethodTypes['users']['getAuthenticated']['response']['data']
  accessToken: string
}
