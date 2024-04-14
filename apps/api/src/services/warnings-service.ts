import { TRPCError } from '@trpc/server'
import { format } from 'date-fns'
import { uniq } from 'lodash'

import { WarningResponse } from '../schemas'
import { EmailService } from './email-service'
import { GithubAppService } from './github-app-service'
import { UsersService } from './users-service'
import { WarningsRepoService } from './warnings-repo-service'

export class WarningsService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService
  ) {}

  async getWarnings(userId: string): Promise<WarningResponse[]> {
    const user = await this.usersService.getByIdWithSensitiveData(userId)

    if (!user.githubAppInstallationId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `The user has not given access to his repositories yet.`
      })
    }

    const githubAppService = await GithubAppService.build(
      user.githubAppInstallationId
    )

    const warningsRepoService = new WarningsRepoService(
      {
        headBranch: user.headBranch,
        baseBranch: user.baseBranch
      },
      githubAppService
    )

    const warnings = await warningsRepoService.getWarnings().catch(() => {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while fetching warnings.'
      })
    })

    if (warnings.length === 0) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `You don't have any repositories.`
      })
    }

    return warnings
  }

  async sendWarnings(userId: string): Promise<void> {
    const warnings = await this.getWarnings(userId)

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
        const date = new Date()
        const formattedDate = format(date, 'MMMM d')

        return this.emailService.sendEmail({
          to: author,
          subject: `Reminder - ${formattedDate}`,
          text: message
        })
      })
    )
  }

  async sendWarningsForAllUsers(): Promise<void> {
    const users = await this.usersService.findAll().catch(() => {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `We could not fetch users list.`
      })
    })

    await Promise.all(users.map(user => this.sendWarnings(user.id))).catch(
      () => {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `We could not send warnings to all users.`
        })
      }
    )
  }
}
