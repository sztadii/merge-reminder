import { DatabaseId } from './database-connection'

export type DatabaseRecord = {
  _id: DatabaseId
  createdAt: Date
  updatedAt?: Date
}

export type UserDatabaseValues = {
  githubId: number
  githubLogin: string
  githubAccessToken: string
  avatarUrl: string
  role: 'admin' | 'client'
  email?: string
  confirmedEmail?: string
  githubAppInstallationId?: number | null
  stripeCheckoutSessionId?: string | null
}

export type ReposConfigurationDatabaseValues = {
  userId: string
  headBranch: string
  baseBranch: string
  excludeReposWithoutRequiredBranches: boolean
  repos: Array<{
    repoId: number
    isIgnored: boolean
    headBranch?: string
    baseBranch?: string
  }>
}

export type UserDatabaseRecord = DatabaseRecord & UserDatabaseValues

export type ReposConfigurationRecord = DatabaseRecord &
  ReposConfigurationDatabaseValues
