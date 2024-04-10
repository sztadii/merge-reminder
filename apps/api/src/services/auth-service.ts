import axios from 'axios'

import { config } from '../config'
import { convertJSONToToken } from '../helpers'
import { LoginRequest, LoginResponse } from '../schemas'

export class AuthService {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const params = `?client_id=${config.github.clientId}&client_secret=${config.github.secret}&code=${request.code}`

    const accessTokenResponse = await axios.post(
      `https://github.com/login/oauth/access_token${params}`,
      null,
      {
        headers: {
          Accept: 'application/json'
        }
      }
    )

    const accessToken = accessTokenResponse.data.access_token

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const userData = userResponse.data

    const token = convertJSONToToken({
      email: userData.email,
      userName: userData.login,
      githubId: userData.idww
    })

    return {
      token
    }
  }
}
