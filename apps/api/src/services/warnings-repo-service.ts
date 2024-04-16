import { TRPCError } from '@trpc/server'
import { differenceInHours } from 'date-fns'

import {
  convertHoursToReadableFormat,
  handlePromise,
  isTruthy
} from '../helpers'
import { GithubAppService, Repo } from './github-app-service'

type RepoWarning = {
  repo: string
  commits: string[]
  compareLink: string
  authors: string[]
  delay: string
}

type Config = {
  baseBranch: string
  headBranch: string
  excludeReposWithoutRequiredBranches: boolean
}

export class WarningsRepoService {
  constructor(
    private config: Config,
    private githubAppService: GithubAppService
  ) {}

  public async getWarnings(): Promise<RepoWarning[]> {
    const allRepos = await this.githubAppService.getInstalledRepos()
    return this.getWarningsFromAffectedBranches(allRepos)
  }

  private async getWarningsFromAffectedBranches(
    repos: Repo[]
  ): Promise<RepoWarning[]> {
    const allBranchesResponses = repos.map(async repo => {
      const listBranches = await this.githubAppService.listBranches({
        owner: repo.owner.login,
        repo: repo.name
      })

      if (!this.config.excludeReposWithoutRequiredBranches) {
        const allBranchNames = listBranches.map(branch => branch.name)

        const missingBranch = [
          this.config.baseBranch,
          this.config.headBranch
        ].find(requiredBranch => !allBranchNames.includes(requiredBranch))

        if (missingBranch) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `The ${missingBranch} branch is missing in the ${repo.name} repo.`
          })
        }
      }

      const [compareCommits] = await handlePromise(
        this.githubAppService.compareCommits({
          owner: repo.owner.login,
          repo: repo.name,
          base: this.config.baseBranch,
          head: this.config.headBranch
        })
      )

      const { files = [], commits: rawCommits = [] } = compareCommits || {}
      const commits = rawCommits.filter(rawCommit => {
        const commiterName = (
          rawCommit.commit.committer?.name || ''
        ).toLowerCase()

        return commiterName !== 'github'
      })

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
        compareLink: `https://github.com/${repo.owner.login}/${repo.name}/compare/${this.config.baseBranch}...${this.config.headBranch}`,
        authors,
        delay: convertHoursToReadableFormat(firstCommitDelayInHours)
      }
    })

    const allBranchesInfos = await Promise.all(allBranchesResponses)

    return allBranchesInfos.filter(isTruthy)
  }
}
