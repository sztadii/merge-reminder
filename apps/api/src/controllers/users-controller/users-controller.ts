import {
  EmailConfirmRequest,
  EmailUpdateRequest,
  SendEmailConfirmationRequest,
  UserResponse
} from '@apps/shared/schemas'

import { config } from '@apps/api/config'
import { UnexpectedError } from '@apps/api/errors/common-errors'
import {
  UserNotFoundError,
  WrongUserTokenError
} from '@apps/api/errors/user-errors'
import { convertJSONToToken, convertTokenToJSON } from '@apps/api/helpers'
import { UsersRepository } from '@apps/api/repositories/users-repository'
import { EmailService } from '@apps/api/services/email-service'

export class UsersController {
  constructor(
    private usersRepository: UsersRepository,
    private emailService: EmailService
  ) {}

  async getById(id: string): Promise<UserResponse> {
    const user = await this.usersRepository.getById(id).catch(() => {
      throw new UnexpectedError('An error occurred while getting the user.')
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    const isEmailConfirmed =
      !!user.email?.length &&
      !!user.confirmedEmail?.length &&
      user.email === user.confirmedEmail

    const userSubscriptionInfo =
      await this.usersRepository.getUserSubscriptionInfo(user._id.toString())

    if (!userSubscriptionInfo) {
      throw new UnexpectedError(
        'Something went wrong when fetching subscription info.'
      )
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
      throw new UnexpectedError('An error occurred while updating the user.')
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
      throw new WrongUserTokenError()
    }

    try {
      const { userId, confirmedEmail } = data

      await this.usersRepository.updateById(userId, {
        confirmedEmail
      })
    } catch {
      throw new UnexpectedError('An error occurred while updating the user.')
    }
  }

  async stopDeletion(userId: string): Promise<void> {
    try {
      await this.usersRepository.updateById(userId, {
        deletedDate: null
      })
    } catch {
      throw new UnexpectedError('An error occurred while stop deletion.')
    }
  }
}

type EmailDataToken = {
  userId: string
  confirmedEmail: string
}
