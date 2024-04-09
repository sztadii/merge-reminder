import { UserResponse, Warning } from '../schemas'
import { GithubService } from './github-service'
import { UsersService } from './users-service'
import { WarningsRepoService } from './warnings-repo-service'

export class WarningsService {
  constructor(private usersService: UsersService) {}

  async getWarnings(userId: UserResponse['id']): Promise<Warning[]> {
    const user = await this.usersService.getById(userId)

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
