import axios from 'axios'
import { addHours } from 'date-fns'

import { config } from '../config'
import { convertJSONToToken } from '../helpers'
import { LoginRequest, LoginResponse } from '../schemas'
import { UsersService } from './users-service'

export class AuthService {
  constructor(private userService: UsersService) {}

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

    const githubUserResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    // const user = this.userService.getById()

    const token = convertJSONToToken({
      email: githubUserResponse.data.email,
      userName: githubUserResponse.data.login,
      // Github token expires in 8h
      expiredAt: addHours(new Date(), 6).toString()
    })!

    return {
      token
    }
  }
}
