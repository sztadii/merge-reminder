import { TRPCError } from '@trpc/server'
import { uniq } from 'lodash'

import { WarningResponse } from '@apps/shared/schemas'

import { UnexpectedError } from '@apps/api/errors/common-errors'
import { MissingBranchError } from '@apps/api/errors/other-errors'
import { ConfigurationNotFoundError } from '@apps/api/errors/repos-errors'
import {
  NoActiveSubscriptionError,
  UserNoRepoAccessError,
  UserNotFoundError
} from '@apps/api/errors/user-errors'
import { getCurrentFormattedDate } from '@apps/api/helpers'
import { Logger } from '@apps/api/logger'
import { ReposConfigurationsRepository } from '@apps/api/repositories/repos-configurations-repository'
import { UsersRepository } from '@apps/api/repositories/users-repository'
import { WarningsRepository } from '@apps/api/repositories/warnings-repository'
import { EmailService } from '@apps/api/services/email-service'

export class WarningsController {
  constructor(
    private usersRepository: UsersRepository,
    private warningsRepository: WarningsRepository,
    private reposConfigurationsRepository: ReposConfigurationsRepository,
    private emailService: EmailService,
    private logger: Logger
  ) {}

  async getWarnings(userId: string): Promise<WarningResponse[]> {
    const user = await this.usersRepository.getById(userId)
    const userSubscriptionInfo =
      await this.usersRepository.getUserSubscriptionInfo(userId)

    if (!user?.githubAppInstallationId) {
      throw new UserNoRepoAccessError()
    }

    if (!userSubscriptionInfo) {
      throw new UnexpectedError(
        'Something went wrong when fetching subscription info.'
      )
    }

    if (!userSubscriptionInfo.isActiveSubscription) {
      throw new NoActiveSubscriptionError()
    }

    const reposConfiguration =
      await this.reposConfigurationsRepository.getByUserId(userId)

    if (!reposConfiguration) {
      throw new ConfigurationNotFoundError()
    }

    const warnings = await this.warningsRepository
      .getWarnings(reposConfiguration, user.githubAppInstallationId)
      .catch(e => {
        if (e instanceof MissingBranchError)
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: e.message
          })

        throw new UnexpectedError('An error occurred while fetching warnings.')
      })

    return warnings
  }

  async sendWarnings(userId: string): Promise<void> {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      this.logger.error(`User with ID ${userId} not found`)
      throw new UserNotFoundError()
    }

    const warnings = await this.getWarnings(userId).catch(async e => {
      const isNoActiveSubscriptionError = e instanceof NoActiveSubscriptionError

      if (!isNoActiveSubscriptionError) throw e

      if (user.email) {
        const currentFormattedDate = getCurrentFormattedDate()

        await this.emailService.sendEmail({
          to: user.email,
          subject: `Subscription in ${currentFormattedDate}`,
          text: e.message
        })

        this.logger.log(`No active subscription email sent to ${userId}`)
      } else {
        this.logger.log(
          `User ${userId} has no active subscription and no email too.`
        )
      }

      return []
    })

    const allAuthors = uniq(warnings.flatMap(warning => warning.authors))

    await Promise.all(
      allAuthors.map(author => {
        const reposTouchedByAuthor = warnings.filter(warning =>
          warning.authors.includes(author)
        )

        const message = [
          'You forgot to merge your changes.',
          'Please visit the repositories below to see what is unmerged.',
          '',
          ...reposTouchedByAuthor.flatMap(repo => [
            `Repository: ${repo.repo}`,
            `Link: ${repo.compareLink}`,
            ''
          ])
        ].join('\n')
        const currentFormattedDate = getCurrentFormattedDate()

        return this.emailService.sendEmail({
          to: author,
          subject: `Unmerged changes in ${currentFormattedDate}`,
          text: message
        })
      })
    ).catch(() => {
      throw new UnexpectedError('We could not send warnings.')
    })
  }

  async sendWarningsForAllUsers(): Promise<void> {
    this.logger.log('sendWarningsForAllUsers started')

    const users = await this.usersRepository.findAll().catch(() => {
      throw new UnexpectedError('We could not fetch users list.')
    })

    await Promise.all(
      users.map(user => this.sendWarnings(user._id.toString()))
    ).catch(() => {
      throw new UnexpectedError('We could not send warnings to all users.')
    })

    this.logger.log('sendWarningsForAllUsers finished')
  }
}
