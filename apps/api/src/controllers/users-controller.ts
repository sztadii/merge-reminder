import { TRPCError } from '@trpc/server'
import { differenceInDays } from 'date-fns'

import { config } from '../config'
import { UserDatabaseRecord } from '../database'
import { convertJSONToToken, convertTokenToJSON } from '../helpers'
import { UsersRepository } from '../repositories/users-repository'
import {
  EmailConfirmRequest,
  EmailUpdateRequest,
  SendEmailConfirmationRequest,
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
    userId: string,
    request: EmailUpdateRequest
  ): Promise<void> {
    const { email } = request

    try {
      await this.usersRepository.updateById(userId, {
        email,
        confirmedEmail: ''
      })
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while updating the user.'
      })
    }

    this.sendEmailConfirmation(userId, request).catch()
  }

  async sendEmailConfirmation(
    userId: string,
    request: SendEmailConfirmationRequest
  ): Promise<void> {
    const { email } = request

    try {
      const { webDomain } = config.app
      const emailDataToken: EmailDataToken = {
        userId,
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

  async confirmEmail(request: EmailConfirmRequest): Promise<void> {
    const token = request.token
    const data = convertTokenToJSON<EmailDataToken>(token)

    if (!data) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'An error occurred while checking the token.'
      })
    }

    try {
      const { userId, confirmedEmail } = data

      await this.usersRepository.updateById(userId, {
        confirmedEmail
      })
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while updating the user.'
      })
    }
  }

  async stopDeletion(userId: string): Promise<void> {
    try {
      await this.usersRepository.updateById(userId, {
        deletedDate: null
      })
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while stop deletion.'
      })
    }
  }

  private mapRecordToResponse(user: UserDatabaseRecord): UserResponse {
    const isEmailConfirmed =
      !!user.email?.length &&
      !!user.confirmedEmail?.length &&
      user.email === user.confirmedEmail

    const countOfFreeTrialDays = this.getCountOfFreeTrialDays(user)
    const isActiveFreeTrial = countOfFreeTrialDays > 0
    const isActiveSubscription = this.isActiveSubscription(
      isActiveFreeTrial,
      user
    )

    return {
      id: user._id.toString(),
      avatarUrl: user.avatarUrl,
      email: user.email,
      hasInstallationId: !!user.githubAppInstallationId,
      isEmailConfirmed,
      stripeCheckoutSessionId: user.stripeCheckoutSessionId,
      isDeleted: !!user.deletedDate,
      countOfFreeTrialDays,
      isActiveFreeTrial,
      isActiveSubscription
    }
  }

  private getCountOfFreeTrialDays(user: UserDatabaseRecord): number {
    const today = new Date()
    const daysSinceCreation = differenceInDays(today, user.createdAt)

    return config.app.freeTrialLengthInDays - daysSinceCreation
  }

  private isActiveSubscription(
    isActiveFreeTrial: boolean,
    user: UserDatabaseRecord
  ): boolean {
    const isStripeInvoicePaid = false
    return isActiveFreeTrial || isStripeInvoicePaid
  }
}

type EmailDataToken = {
  userId: string
  confirmedEmail: string
}
