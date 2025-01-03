import { createAppAuth } from '@octokit/auth-app'
import { RestEndpointMethodTypes } from '@octokit/rest'
import { Octokit } from 'octokit'

import { config } from '@apps/api/config'

export class GithubKitRepository {
  async listBranches(
    installationId: number,
    params: ListBranchesParams
  ): Promise<Branch[]> {
    const octokit = this.createKitInstance(installationId)
    const response = await octokit.rest.repos.listBranches(params)
    return response.data
  }

  async compareCommits(
    installationId: number,
    params: CompareCommitsParams
  ): Promise<CompareCommits> {
    const octokit = this.createKitInstance(installationId)
    const response = await octokit.rest.repos.compareCommitsWithBasehead({
      owner: params.owner,
      repo: params.repo,
      basehead: `${params.baseBranch}...${params.headBranch}`
    })
    return response.data
  }

  async getInstalledRepos(installationId: number): Promise<Repo[]> {
    const octokit = this.createKitInstance(installationId)
    const allRepos = []
    let canFetchMoreData = true

    for (let i = 1; canFetchMoreData; i++) {
      const responseWithRepos =
        await octokit.rest.apps.listReposAccessibleToInstallation({
          page: i,
          per_page: 100
        })

      const { repositories } = responseWithRepos.data

      canFetchMoreData = !!repositories.length
      allRepos.push(...repositories)
    }

    return allRepos
  }

  private createKitInstance(installationId: number) {
    return new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: config.github.appId,
        privateKey: config.github.appPrivateKey.replace(/\\n/g, '\n'),
        installationId
      }
    })
  }
}

type Repo =
  RestEndpointMethodTypes['apps']['listReposAccessibleToInstallation']['response']['data']['repositories'][0]

type ListBranchesParams =
  RestEndpointMethodTypes['repos']['listBranches']['parameters']

type Branch =
  RestEndpointMethodTypes['repos']['listBranches']['response']['data'][0]

type CompareCommitsParams = {
  owner: string
  repo: string
  baseBranch: string
  headBranch: string
}

type CompareCommits =
  RestEndpointMethodTypes['repos']['compareCommitsWithBasehead']['response']['data']
