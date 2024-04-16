import { GithubAppService } from './github-app-service'
import { UsersService } from './users-service'

export class InstallationService {
  constructor(private userService: UsersService) {}

  async disconnectRepositories(userId: string) {
    const user = await this.userService.getByIdWithSensitiveData(userId)

    if (user.githubAppInstallationId) {
      const githubAppService = await GithubAppService.build(
        user.githubAppInstallationId
      )
      await githubAppService.deleteApp()
    }

    await this.userService.updateInstallationId(userId, null)
  }
}
