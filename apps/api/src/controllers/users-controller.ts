import { TRPCError } from '@trpc/server'

import { config } from '../config'
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
    const user = await this.usersRepository.getById(id).catch(() => {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while getting the user.'
      })
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `The user not found.`
      })
    }

    const isEmailConfirmed =
      !!user.email?.length &&
      !!user.confirmedEmail?.length &&
      user.email === user.confirmedEmail

    const userSubscriptionInfo =
      await this.usersRepository.getUserSubscriptionInfo(user._id.toString())

    if (!userSubscriptionInfo) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Something went wrong when fetching subscription info.`
      })
    }

    return {
      id: user._id.toString(),
      avatarUrl: user.avatarUrl,
      email: user.email,
      hasInstallationId: !!user.githubAppInstallationId,
      isEmailConfirmed,
      stripeCheckoutSessionId: user.stripeCheckoutSessionId,
      isDeleted: !!user.deletedDate,
      isActiveFreeTrial: userSubscriptionInfo.isActiveFreeTrial,
      countOfFreeTrialDays: userSubscriptionInfo.countOfFreeTrialDays,
      isActiveSubscription: userSubscriptionInfo.isActiveSubscription
    }
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
}

type EmailDataToken = {
  userId: string
  confirmedEmail: string
}
