import { differenceInHours } from 'date-fns'

import {
  convertHoursToReadableFormat,
  handlePromise,
  isTruthy,
  promiseAllInBatches
} from '../helpers'
import { GithubAppRepository, Repo } from './github-app-repository'

export class WarningsRepository {
  constructor(
    private config: Config,
    private githubAppRepository: GithubAppRepository
  ) {}

  public async getWarnings(): Promise<RepoWarning[]> {
    const allRepos = await this.githubAppRepository.getInstalledRepos()
    const ignoredRepos = this.config.repos
      .filter(repo => repo.isIgnored)
      .map(repo => repo.repoId)
    const notIgnoredRepos = allRepos.filter(
      repo => !ignoredRepos.includes(repo.id)
    )
    return this.getWarningsFromAffectedBranches(notIgnoredRepos)
  }

  private async getWarningsFromAffectedBranches(
    repos: Repo[]
  ): Promise<RepoWarning[]> {
    const allBranchesResponses = repos.map(async repo => {
      const listBranches = await this.githubAppRepository.listBranches({
        owner: repo.owner.login,
        repo: repo.name
      })

      const configurationForCurrentRepo = this.config.repos.find(
        iteratedRepo => iteratedRepo.repoId === repo.id
      )

      const headBranch =
        configurationForCurrentRepo?.headBranch || this.config.headBranch
      const baseBranch =
        configurationForCurrentRepo?.baseBranch || this.config.baseBranch

      if (!this.config.excludeReposWithoutRequiredBranches) {
        const allBranchNames = listBranches.map(branch => branch.name)

        const missingBranch = [headBranch, baseBranch].find(
          requiredBranch => !allBranchNames.includes(requiredBranch)
        )

        if (missingBranch) {
          throw new MissingBranchError(
            `The ${missingBranch} branch is missing in the ${repo.name} repo.`
          )
        }
      }

      const [compareCommits] = await handlePromise(
        this.githubAppRepository.compareCommits({
          owner: repo.owner.login,
          repo: repo.name,
          baseBranch,
          headBranch
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
        compareLink: `https://github.com/${repo.owner.login}/${repo.name}/compare/${baseBranch}...${headBranch}`,
        authors,
        delay: convertHoursToReadableFormat(firstCommitDelayInHours)
      }
    })

    const allBranchesInfos = await promiseAllInBatches(allBranchesResponses)

    return allBranchesInfos.filter(isTruthy)
  }
}

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
  repos: Array<{
    repoId: number
    isIgnored: boolean
    baseBranch?: string
    headBranch?: string
  }>
}

export class MissingBranchError extends Error {}
