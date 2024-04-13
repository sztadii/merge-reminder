import { RestEndpointMethodTypes } from '@octokit/rest'
import { App, Octokit } from 'octokit'

import { config } from '../config'

export class GithubAppService {
  constructor(
    private app: App,
    private octokit: Octokit,
    private installationId: number
  ) {}

  public static async build(installationId: number) {
    const app = new App({
      appId: config.github.appId,
      // There is a problem with multilines private keys.
      // I found this solution on stackoverflow and seems working.
      privateKey: config.github.privateKey.replace(/\\n/g, '\n')
    })

    const octokit = await app.getInstallationOctokit(installationId)

    return new GithubAppService(app, octokit, installationId)
  }

  async listBranches(params: ListBranchesParams): Promise<Branch[]> {
    const response = await this.octokit.rest.repos.listBranches(params)
    return response.data
  }

  async compareCommits(params: CompareCommitsParams): Promise<CompareCommits> {
    const response = await this.octokit.rest.repos.compareCommits(params)
    return response.data
  }

  async getInstalledRepos(): Promise<Repo[]> {
    const allRepos = []
    let canFetchMoreData = true

    for (let i = 1; canFetchMoreData; i++) {
      const responseWithRepos =
        await this.octokit.rest.apps.listReposAccessibleToInstallation({
          page: i,
          per_page: 100
        })

      const { repositories } = responseWithRepos.data

      canFetchMoreData = !!repositories.length
      allRepos.push(...repositories)
    }

    return allRepos
  }

  async deleteApp(): Promise<void> {
    await this.app.octokit.rest.apps.deleteInstallation({
      installation_id: this.installationId
    })
  }
}

export type Repo =
  RestEndpointMethodTypes['apps']['listReposAccessibleToInstallation']['response']['data']['repositories'][0]

type ListBranchesParams =
  RestEndpointMethodTypes['repos']['listBranches']['parameters']

type Branch =
  RestEndpointMethodTypes['repos']['listBranches']['response']['data'][0]

type CompareCommitsParams =
  RestEndpointMethodTypes['repos']['compareCommits']['parameters']

type CompareCommits =
  RestEndpointMethodTypes['repos']['compareCommits']['response']['data']
