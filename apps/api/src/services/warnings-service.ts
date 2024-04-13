import { TRPCError } from '@trpc/server'
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

    const warnings = await warningsRepoService.getWarnings().catch(error => {
      // TODO We can not redirect user when we save a wrong token.
      // Otherwise we will make our system unusable.
      // Check if we can make it better.
      if (error?.status === 401) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Your access token is incorrect or has expired.`
        })
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while fetching repositories.'
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

        return this.emailService.sendEmail({
          to: author,
          subject: 'Reminder',
          text: message
        })
      })
    )
  }
}
