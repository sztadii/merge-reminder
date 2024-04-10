import { Octokit, RestEndpointMethodTypes } from '@octokit/rest'

export type Repo =
  RestEndpointMethodTypes['repos']['listForOrg']['response']['data'][0]

export class GithubService extends Octokit {
  constructor(accessToken: string) {
    super({ auth: accessToken })
  }

  async getAllRepos(
    userOrOrganizationName: string,
    isOrganization: boolean
  ): Promise<Repo[]> {
    const allRepos = []
    let canFetchMoreData = true

    for (let i = 1; canFetchMoreData; i++) {
      console.log(`Fetching repos from page nr ${i}`)

      const responseWithRepos = isOrganization
        ? await this.repos.listForOrg({
            org: userOrOrganizationName,
            page: i,
            per_page: 100
          })
        : await this.repos.listForUser({
            username: userOrOrganizationName,
            page: i,
            per_page: 100
          })

      const { data: repos } = responseWithRepos

      canFetchMoreData = !!repos.length
      allRepos.push(...repos)
    }

    console.log(`Fetched ${allRepos.length} repos \n`)

    return allRepos
  }
}
