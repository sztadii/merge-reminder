import { RestEndpointMethodTypes } from '@octokit/rest'
import { App } from 'octokit'

import { config } from '@apps/api/config'

export class GithubAppRepository {
  async deleteApp(installationId: number): Promise<void> {
    const app = this.createAppInstance()

    await app.octokit.rest.apps.deleteInstallation({
      installation_id: installationId
    })
  }

  private createAppInstance() {
    return new App({
      appId: config.github.appId,
      privateKey: config.github.appPrivateKey.replace(/\\n/g, '\n')
    })
  }
}

export type Repo =
  RestEndpointMethodTypes['apps']['listReposAccessibleToInstallation']['response']['data']['repositories'][0]
