import { RestEndpointMethodTypes } from '@octokit/rest'
import axios from 'axios'
import { Octokit } from 'octokit'

import { config } from '../config'

export class GithubAuthService {
  async getAuthUser(code: string): Promise<AuthUser> {
    const accessToken = await this.getAccessToken(code)
    const octokit = new Octokit({ auth: accessToken })
    const response = await octokit.rest.users.getAuthenticated()

    return response.data
  }

  private async getAccessToken(code: string): Promise<string> {
    const params = `?client_id=${config.github.clientId}&client_secret=${config.github.secret}&code=${code}`

    const accessTokenResponse = await axios.post(
      `https://github.com/login/oauth/access_token${params}`,
      null,
      {
        headers: {
          accept: 'application/json'
        }
      }
    )

    return accessTokenResponse.data.access_token
  }
}

type AuthUser =
  RestEndpointMethodTypes['users']['getAuthenticated']['response']['data']
