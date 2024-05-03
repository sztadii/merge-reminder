import { TRPCError } from '@trpc/server'
import { format } from 'date-fns'
import { uniq } from 'lodash'

import { promiseAllInBatches } from '../helpers'
import { GithubAppRepository } from '../repositories/github-app-repository'
import { ReposConfigurationsRepository } from '../repositories/repos-configurations-repository'
import { UsersRepository } from '../repositories/users-repository'
import {
  MissingBranchError,
  WarningsRepository
} from '../repositories/warnings-repository'
import { WarningResponse } from '../schemas'
import { EmailService } from '../services/email-service'

export class WarningsController {
  constructor(
    private usersRepository: UsersRepository,
    private reposConfigurationsRepository: ReposConfigurationsRepository,
    private emailService: EmailService
  ) {}

  async getWarnings(userId: string): Promise<WarningResponse[]> {
    const user = await this.usersRepository.getById(userId)
    const userSubscriptionInfo =
      await this.usersRepository.getUserSubscriptionInfo(userId)

    if (!user?.githubAppInstallationId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `The user has not given access to his repositories yet.`
      })
    }

    if (!userSubscriptionInfo) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Something went wrong when fetching subscription info.`
      })
    }

    if (!userSubscriptionInfo.isActiveSubscription) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Your subscription is not active anymore.`
      })
    }

    const githubAppRepository = await GithubAppRepository.build(
      user.githubAppInstallationId
    )

    const reposConfiguration =
      await this.reposConfigurationsRepository.getByUserId(userId)

    if (!reposConfiguration) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `The configuration not found for this user.`
      })
    }

    const warningsRepository = new WarningsRepository(
      reposConfiguration,
      githubAppRepository
    )

    const warnings = await warningsRepository.getWarnings().catch(e => {
      if (e instanceof MissingBranchError)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: e.message
        })

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while fetching warnings.'
      })
    })

    return warnings
  }

  async sendWarnings(userId: string): Promise<void> {
    const warnings = await this.getWarnings(userId)

    const allAuthors = uniq(warnings.flatMap(warning => warning.authors))

    await promiseAllInBatches(
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
        const date = new Date()
        const formattedDate = format(date, 'MMMM d')

        return this.emailService.sendEmail({
          to: author,
          subject: `Unmerged changes in ${formattedDate}`,
          text: message
        })
      })
    ).catch(() => {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `We could not send warnings.`
      })
    })
  }

  async sendWarningsForAllUsers(): Promise<void> {
    const users = await this.usersRepository.findAll().catch(() => {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `We could not fetch users list.`
      })
    })

    await promiseAllInBatches(
      users.map(user => this.sendWarnings(user._id.toString()))
    ).catch(() => {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `We could not send warnings to all users.`
      })
    })
  }
}
