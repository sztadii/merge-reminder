import { Octokit, RestEndpointMethodTypes } from '@octokit/rest'

export type OrganizationRepo =
  RestEndpointMethodTypes['repos']['listForOrg']['response']['data'][0]

export class GithubService {
  private githubService: Octokit

  constructor(accessToken: string) {
    this.githubService = new Octokit({ auth: accessToken })
  }

  async getAllOrganizationRepos(
    organization: string
  ): Promise<OrganizationRepo[]> {
    const allRepos = []
    let canFetchMoreData = true

    for (let i = 1; canFetchMoreData; i++) {
      console.log(`Fetching repos from page nr ${i}`)

      const { data: repos } = await this.githubService.repos.listForOrg({
        org: organization,
        page: i,
        per_page: 100 // GITHUB API is not allowing to fetch more that 100
      })
      canFetchMoreData = !!repos.length
      allRepos.push(...repos)
    }

    console.log(`Fetched ${allRepos.length} repos \n`)

    return allRepos
  }

  compareTwoBranches(
    params: RestEndpointMethodTypes['repos']['compareCommits']['parameters']
  ): Promise<RestEndpointMethodTypes['repos']['compareCommits']['response']> {
    return this.githubService.repos.compareCommits(params)
  }
}
