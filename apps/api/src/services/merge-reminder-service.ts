import { differenceInCalendarDays } from 'date-fns'

import { handlePromise, isTruthy } from '../helpers'
import { GithubService, OrganizationRepo } from './github-service'

type RepoInfo = {
  repoName: string
  commitsCount: number
  authors: string[]
  delay: number
}

type Config = {
  baseBranch: string
  headBranch: string
  organization: string
}

export class MergeReminderService {
  constructor(
    private config: Config,
    private githubService: GithubService
  ) {}

  public async getReminder(): Promise<string> {
    console.log('\nStart running checkBranches script \n')

    const [allOrganizationRepos, error] = await handlePromise(
      this.githubService.getAllOrganizationRepos(this.config.organization)
    )

    if (error) {
      return 'Something went wrong during fetching organization repos :('
    }

    if (!allOrganizationRepos || allOrganizationRepos.length === 0) {
      return 'Organization do not have any repos :('
    }

    const infosFromAffectedBranches =
      await this.getInfosFromAffectedBranches(allOrganizationRepos)

    if (infosFromAffectedBranches.length) {
      return this.prepareMessage(infosFromAffectedBranches)
    }

    return 'All your repos are looking well. Good job team :)'
  }

  private async getInfosFromAffectedBranches(
    repos: OrganizationRepo[]
  ): Promise<RepoInfo[]> {
    const allBranchesResponses = repos.map(async repo => {
      const [compareData] = await handlePromise(
        this.githubService.compareTwoBranches({
          owner: repo.owner.login,
          repo: repo.name,
          base: this.config.baseBranch,
          head: this.config.headBranch
        })
      )

      const { files = [], commits: rawCommits = [] } = compareData?.data || {}
      const commits = rawCommits.filter(
        rawCommit => rawCommit.commit.committer?.name !== 'Github'
      )
      const allAuthors = commits
        .map(commit => commit?.commit.author?.email)
        .filter(isTruthy)
      const authors = [...new Set(allAuthors)]
      const hasDataToProcess = files.length && commits.length && !repo.archived

      if (!hasDataToProcess) return

      const current = new Date()
      const past = new Date(commits[0].commit.committer?.date!)
      const firstCommitDelayInDays = differenceInCalendarDays(current, past)

      return {
        repoName: repo.name,
        commitsCount: commits.length,
        authors,
        delay: firstCommitDelayInDays
      }
    })

    const allBranchesInfos = await Promise.all(allBranchesResponses)

    return allBranchesInfos.filter(isTruthy)
  }

  private prepareMessage(repos: RepoInfo[]): string {
    const repositoryHeading =
      repos.length > 1
        ? `${repos.length} REPOSITORIES LISTED BELOW ARE NOT UPDATED PROPERLY. `
        : `REPOSITORY LISTED BELOW IS NOT UPDATED PROPERLY. `
    const branchesMessage = `PLEASE MERGE ${this.config.headBranch.toUpperCase()} TO ${this.config.baseBranch.toUpperCase()} BRANCH.\n`

    let message = repositoryHeading + branchesMessage

    repos.forEach(repo => {
      const { authors, repoName, commitsCount } = repo

      const authorTitle = `Author${authors.length > 1 ? 's' : ''}`
      const commitTitle = `commit${commitsCount > 1 ? 's' : ''}`
      const userTitle = `${authors.join(', ')}`
      message += '-----------------\n'
      message += `Repo: ${repoName}\n`
      message += `${authorTitle} of not updated ${commitTitle}: ${userTitle}\n`

      if (repo.delay)
        message += `Delay: ${repo.delay} day${repo.delay > 1 ? 's' : ''}\n`
    })

    return message
  }
}
