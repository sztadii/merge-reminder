import { RestEndpointMethodTypes } from '@octokit/rest'
import { OAuthApp, Octokit } from 'octokit'

import { config } from '../config'

export class GithubAuthRepository {
  async getAuthUser(code: string): Promise<AuthUser> {
    const auth = new OAuthApp({
      clientId: config.github.authClientId,
      clientSecret: config.github.authClientSecret
    })

    const tokenResponse = await auth.createToken({
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
    const auth = new OAuthApp({
      clientId: config.github.authClientId,
      clientSecret: config.github.authClientSecret
    })

    await auth.deleteAuthorization({
      token: accessToken
    })
  }
}

type AuthUser = {
  user: RestEndpointMethodTypes['users']['getAuthenticated']['response']['data']
  accessToken: string
}
