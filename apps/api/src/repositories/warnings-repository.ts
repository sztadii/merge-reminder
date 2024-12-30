import { differenceInHours } from 'date-fns'

import { MissingBranchError } from '../errors/other-errors'
import {
  convertHoursToReadableFormat,
  handlePromise,
  isTruthy,
  promiseAllInBatches
} from '../helpers'
import { Repo } from './github-app-repository'
import { GithubKitRepository } from './github-kit-repository'

export class WarningsRepository {
  constructor(private githubKitRepository: GithubKitRepository) {}

  public async getWarnings(
    config: Config,
    installationId: number
  ): Promise<RepoWarning[]> {
    const allRepos =
      await this.githubKitRepository.getInstalledRepos(installationId)
    const ignoredRepos = config.repos
      .filter(repo => repo.isIgnored)
      .map(repo => repo.repoId)
    const notIgnoredRepos = allRepos.filter(
      repo => !ignoredRepos.includes(repo.id)
    )
    return this.getWarningsFromAffectedBranches(
      notIgnoredRepos,
      config,
      installationId
    )
  }

  private async getWarningsFromAffectedBranches(
    repos: Repo[],
    config: Config,
    installationId: number
  ): Promise<RepoWarning[]> {
    const allBranchesResponses = repos.map(async repo => {
      const listBranches = await this.githubKitRepository.listBranches(
        installationId,
        {
          owner: repo.owner.login,
          repo: repo.name
        }
      )

      const configurationForCurrentRepo = config.repos.find(
        iteratedRepo => iteratedRepo.repoId === repo.id
      )

      const headBranch =
        configurationForCurrentRepo?.headBranch || config.headBranch
      const baseBranch =
        configurationForCurrentRepo?.baseBranch || config.baseBranch

      if (!config.excludeReposWithoutRequiredBranches) {
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
        this.githubKitRepository.compareCommits(installationId, {
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
