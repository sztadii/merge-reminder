import { differenceInHours } from 'date-fns'

import { handlePromise, isTruthy } from '../helpers'
import { GithubService, Repo } from './github-service'

type RepoWarning = {
  repo: string
  commits: string[]
  compareLink: string
  authors: string[]
  delayInHours: number
}

type Config = {
  baseBranch: string
  headBranch: string
  userOrOrganizationName: string
  isOrganization: boolean
}

export class WarningsRepoService {
  constructor(
    private config: Config,
    private githubService: GithubService
  ) {}

  public async getWarnings(): Promise<RepoWarning[]> {
    const [allRepos, error] = await handlePromise(
      this.githubService.getAllRepos(
        this.config.userOrOrganizationName,
        this.config.isOrganization
      )
    )

    if (error?.status === 401) {
      throw new Error('Your access token is wrong or get expired.')
    }

    if (error) {
      throw new Error('Something went wrong during fetching repos.')
    }

    if (!allRepos || allRepos.length === 0) {
      throw new Error('You do not have any repos.')
    }

    return this.getWarningsFromAffectedBranches(allRepos)
  }

  private async getWarningsFromAffectedBranches(
    repos: Repo[]
  ): Promise<RepoWarning[]> {
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
      const firstCommitDelayInHours = differenceInHours(current, past)

      return {
        repo: repo.name,
        commits: commits.map(commit => commit.commit.message),
        compareLink: `https://github.com/${this.config.userOrOrganizationName}/${repo.name}/compare/${this.config.baseBranch}...${this.config.headBranch}`,
        authors,
        delayInHours: firstCommitDelayInHours
      }
    })

    const allBranchesInfos = await Promise.all(allBranchesResponses)

    return allBranchesInfos.filter(isTruthy)
  }
}
