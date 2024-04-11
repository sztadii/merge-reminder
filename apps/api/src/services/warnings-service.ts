import { TRPCError } from '@trpc/server'
import { uniq } from 'lodash'

import { WarningResponse } from '../schemas'
import { EmailService } from './email-service'
import { GithubService } from './github-service'
import { UsersService } from './users-service'
import { WarningsRepoService } from './warnings-repo-service'

export class WarningsService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService
  ) {}

  async getWarnings(userId: string): Promise<WarningResponse[]> {
    const user = await this.usersService.getById(userId)

    if (!user.githubAccessToken) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `The user has not set their GitHub access token yet.`
      })
    }

    const warningsRepoService = new WarningsRepoService(
      {
        headBranch: user.headBranch,
        baseBranch: user.baseBranch,
        userOrOrganizationName: user.userOrOrganizationName,
        isOrganization: user.isOrganization
      },
      new GithubService(user.githubAccessToken)
    )

    return warningsRepoService.getWarnings()
  }

  async sendWarnings(userId: string): Promise<void> {
    const warnings = await this.getWarnings(userId)

    const allAuthors = uniq(warnings.flatMap(warning => warning.authors))

    await Promise.all(
      allAuthors.map(author => {
        return this.emailService.sendEmail({
          to: author,
          subject: 'Reminder',
          text: 'You forgot to merge your changes!'
        })
      })
    )
  }
}
