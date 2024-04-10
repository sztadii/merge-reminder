import { TRPCError } from '@trpc/server'

import { UserResponse, Warning } from '../schemas'
import { GithubService } from './github-service'
import { UsersService } from './users-service'
import { WarningsRepoService } from './warnings-repo-service'

export class WarningsService {
  constructor(private usersService: UsersService) {}

  async getWarnings(userId: UserResponse['id']): Promise<Warning[]> {
    const user = await this.usersService.getById(userId)

    if (!user.githubAccessToken) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `User did not set Github access token yet!`
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
