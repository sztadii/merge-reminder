import { RestEndpointMethodTypes } from '@octokit/rest'
import { App, Octokit } from 'octokit'

export class GithubAppService {
  constructor(
    private app: App,
    private octokit: Octokit,
    private installationId: number
  ) {}

  public static async build(installationId: number) {
    const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAxagJbXPcZK8gkKy40eskNu5oACewBPH5YYifgIBhIYmv2X79
m7gg46Pc2SnmdbCfgIty48gpjNgf6Qkty3VVH+lQZDmX69ee43hvU0V129t259r+
AiZ9zUFPRzkGIhKI3QVNxwXj6+c45Qfc2v/w58ZSsTZkX73qctNEjeuZhINhpu/F
pXaCZ8UYI4HBtyN/oUrb16K36juK9WZJJ2olKMEUxfVgUKAxTSXf1OVCOSasbsAm
8YV96MIz+GPZ3tV0+Md5CeoTi6dFb0OgjR0URd9D3EdhwcVF3tNW7cbV+hYXexei
RzfrA29OA2QNLzscWLvY4d1qNdcaUbLMvs+cFwIDAQABAoIBAFv1mSVGQWTKodEN
uxNXXkr8UoC39knmtortQKBNmmM7Jwh+78kyOoMOquKSfvmEikEJIBPf/YzcxMPs
FFVTqp4lM9TdgtQkRnU4hDru1y3KBqFKnuErPV5wo0zUuAjELM7/97bAA9Guiybr
qJJvf4qmF7UBRGPS/TAdIQkScyNWFz4DH8TNwkOHdTcev89+taApG34pjufZq4kH
6vmdLzh1GvZDr+AWhwf/608ytI7ED3zYvmdkl1mWKVbQ3YCFv7wlfnRk4w8mNEBu
YaaPhQJ0w9wv/9Fgp4iaFThdEOcnjX+UKe7im64A7IJRIZIBb1nxazq+MoiD0tTv
rFpuupkCgYEA7nvYhBlGoIzvetowDQK+Uk1d0VS2gq2i7ks5+cet/+socngcIesk
nXFcsxbRKxZXxmHjmLLs7uk24BUtP0lfNFbvL4xPxlP5e0cUqNRcb+rlcdiBke7L
CmOuVSh3xhntqkjiiVjMLd2exhcvtgMuQ9/0epfUWeWV+9LGlFyla5sCgYEA1CyG
AirbazFfnsr1+yT2nlrUYplhn9PvqFq3/Ao86kMkqFq9QktEbHxTG9cse4nwQOUW
j5p/ajsiWqekfKp5jMaTOb/NPGIkqgU7/TJBv+tcxaO5fI8CLxyXyf4uLm0wUlYi
6nnuaqcU3GzzVPRTj7nzKPT7LK+LiaNdfLeKzzUCgYBz/oC9H54ekO4aDu24JlFz
rnWnT1DGFrZcuPIl711OUI6HvqvQQ5K3kV/JK5vpHSDsOMh+iOh8+6nZK/OqCIHp
7y6/LbvPdyCtOVFvHHspZFLdILVEyaSwFPPCL8Cx9gKHBJRKwYnt9RE4wCZQnRNv
qAo9ZoO+hdCBf29e0gETaQKBgEmwIOaVzdi/sA7tPFr57nD26LZJwN8KczyMLUPq
pldR9GRIB10D2QK4dwC/TWKmeHuBVMGRDdluKjND79ugNVDQEofG9leXWlZ2NOxt
zOoDqxe1EhGRdVe5XXo4vf8/yr19zuiSalw+JP+dEzGZHYBYO3wpASb23MZzp19O
O3ZVAoGBAMoXVXVJqLyH7wDAg8uIMi2ariArtvxrd5D+RiSuxdyYldn3Blt3iqu+
vppBAU0SDjfnqcT5kPA+tpMZCc2RDtR7s+CKFVjYbHDfXYoP6G83WTHGkK0Nvp1Q
mBlwqN1FblKszX/kkqY5yDSNlf6RYByJdm9vRaMoNN+H1995nQra
-----END RSA PRIVATE KEY-----`
    const app = new App({
      appId: '875604',
      privateKey: privateKey
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
