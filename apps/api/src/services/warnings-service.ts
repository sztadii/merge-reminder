import { TRPCError } from '@trpc/server'

import { WarningResponse } from '../schemas'
import { GithubService } from './github-service'
import { UsersService } from './users-service'
import { WarningsRepoService } from './warnings-repo-service'

export class WarningsService {
  constructor(private usersService: UsersService) {}

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
}
