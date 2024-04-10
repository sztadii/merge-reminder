import { TRPCError } from '@trpc/server'
import { differenceInHours } from 'date-fns'

import {
  convertHoursToReadableFormat,
  handlePromise,
  isTruthy
} from '../helpers'
import { GithubService, Repo } from './github-service'

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

    if (error?.status === 404) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `We could not find your repositories. Are you sure you've filled in the correct organization name?`
      })
    }

    if (error?.status === 401) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: `Your access token is incorrect or has expired.`
      })
    }

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong while fetching repositories.'
      })
    }

    if (!allRepos || allRepos.length === 0) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `You don't have any repositories.`
      })
    }

    return this.getWarningsFromAffectedBranches(allRepos)
  }

  private async getWarningsFromAffectedBranches(
    repos: Repo[]
  ): Promise<RepoWarning[]> {
    const allBranchesResponses = repos.map(async repo => {
      const listBranchesResponse = await this.githubService.repos.listBranches({
        owner: repo.owner.login,
        repo: repo.name
      })

      const allBranchNames = listBranchesResponse.data.map(
        branch => branch.name
      )

      const missingBranch = [
        this.config.baseBranch,
        this.config.headBranch
      ].find(requiredBranch => !allBranchNames.includes(requiredBranch))

      if (missingBranch) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `The ${missingBranch} branch is missing.`
        })
      }

      const [compareData] = await handlePromise(
        this.githubService.repos.compareCommits({
          owner: repo.owner.login,
          repo: repo.name,
          base: this.config.baseBranch,
          head: this.config.headBranch
        })
      )

      const { files = [], commits: rawCommits = [] } = compareData?.data || {}
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
        compareLink: `https://github.com/${this.config.userOrOrganizationName}/${repo.name}/compare/${this.config.baseBranch}...${this.config.headBranch}`,
        authors,
        delay: convertHoursToReadableFormat(firstCommitDelayInHours)
      }
    })

    const allBranchesInfos = await Promise.all(allBranchesResponses)

    return allBranchesInfos.filter(isTruthy)
  }
}
