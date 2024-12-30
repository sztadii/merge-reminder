import { TRPCError } from '@trpc/server'
import { uniq } from 'lodash'

import { UnexpectedError } from '../errors/common-errors'
import { MissingBranchError } from '../errors/other-errors'
import { ConfigurationNotFoundError } from '../errors/repos-errors'
import {
  NoActiveSubscriptionError,
  UserNoRepoAccessError,
  UserNotFoundError
} from '../errors/user-errors'
import { getCurrentFormattedDate } from '../helpers'
import { ReposConfigurationsRepository } from '../repositories/repos-configurations-repository'
import { UsersRepository } from '../repositories/users-repository'
import { WarningsRepository } from '../repositories/warnings-repository'
import { WarningResponse } from '../schemas'
import { EmailService } from '../services/email-service'

export class WarningsController {
  constructor(
    private usersRepository: UsersRepository,
    private warningsRepository: WarningsRepository,
    private reposConfigurationsRepository: ReposConfigurationsRepository,
    private emailService: EmailService
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
      throw new UserNotFoundError()
    }

    const warnings = await this.getWarnings(userId).catch(e => {
      const isNoActiveSubscriptionError = e instanceof NoActiveSubscriptionError

      if (user.email && isNoActiveSubscriptionError) {
        const currentFormattedDate = getCurrentFormattedDate()

        this.emailService.sendEmail({
          to: user.email,
          subject: `Subscription in ${currentFormattedDate}`,
          text: e.message
        })
      }

      throw e
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
    const users = await this.usersRepository.findAll().catch(() => {
      throw new UnexpectedError('We could not fetch users list.')
    })

    await Promise.all(
      users.map(user => this.sendWarnings(user._id.toString()))
    ).catch(() => {
      throw new UnexpectedError('We could not send warnings to all users.')
    })
  }
}
