import { Reminder, UserResponse } from '../schemas'
import { GithubService } from './github-service'
import { MergeReminderService } from './merge-reminder-service'
import { UsersService } from './users-service'

export class RemindersService {
  constructor(private usersService: UsersService) {}

  async getReminder(userId: UserResponse['id']): Promise<Reminder> {
    const user = await this.usersService.getById(userId)

    const mergeReminderService = new MergeReminderService(
      {
        headBranch: 'master',
        baseBranch: 'develop',
        organization: 'AlefEducation'
      },
      new GithubService(user.githubAccessToken)
    )

    return await mergeReminderService.getReminder()
  }
}
