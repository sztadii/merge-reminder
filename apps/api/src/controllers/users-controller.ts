import { TRPCError } from '@trpc/server'

import { config } from '../config'
import { UserDatabaseRecord } from '../database'
import { convertJSONToToken, convertTokenToJSON } from '../helpers'
import { UsersRepository } from '../repositories/users-repository'
import {
  EmailConfirmRequest,
  EmailUpdateRequest,
  UserResponse
} from '../schemas'
import { EmailService } from '../services/email-service'

export class UsersController {
  constructor(
    private usersRepository: UsersRepository,
    private emailService: EmailService
  ) {}

  async getById(id: string): Promise<UserResponse> {
    const record = await this.usersRepository.getById(id).catch(() => {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while getting the user.'
      })
    })

    if (!record) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `The user not found.`
      })
    }

    return this.mapRecordToResponse(record)
  }

  async updateEmail(
    id: string,
    emailUpdateRequest: EmailUpdateRequest
  ): Promise<void> {
    const { email } = emailUpdateRequest

    try {
      await this.usersRepository.updateById(id, {
        email,
        confirmedEmail: ''
      })
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while updating the user.'
      })
    }

    try {
      const { webDomain } = config.app
      const emailDataToken: EmailDataToken = {
        confirmedEmail: email
      }
      const token = convertJSONToToken(emailDataToken)
      const confirmationLink = `${webDomain}/email-confirmation/${token}`
      await this.emailService.sendEmail({
        to: email,
        subject: 'Confirm your email',
        text: `To confirm the email please visit this link ${confirmationLink}`
      })
    } catch {}
  }

  async confirmEmail(
    id: string,
    emailConfirmRequest: EmailConfirmRequest
  ): Promise<void> {
    const token = emailConfirmRequest.token
    const data = convertTokenToJSON<EmailDataToken>(token)

    if (!data) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'An error occurred while checking the token.'
      })
    }

    try {
      const { confirmedEmail } = data

      await this.usersRepository.updateById(id, {
        confirmedEmail
      })
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while updating the user.'
      })
    }
  }

  protected mapRecordToResponse(user: UserDatabaseRecord): UserResponse {
    const isEmailConfirmed =
      !!user.email?.length &&
      !!user.confirmedEmail?.length &&
      user.email === user.confirmedEmail

    return {
      id: user._id.toString(),
      avatarUrl: user.avatarUrl,
      email: user.email,
      hasInstallationId: !!user.githubAppInstallationId,
      isEmailConfirmed
    }
  }
}

type EmailDataToken = {
  confirmedEmail: string
}
