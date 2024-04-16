import { UserResponse } from '../schemas'
import { DatabaseId } from './database-connection'

export type DatabaseRecord = {
  _id: DatabaseId
  createdAt: Date
  updatedAt?: Date
}

export type UserDatabaseRecord = DatabaseRecord & {
  githubId: number
  avatarUrl: string
  role: 'admin' | 'client'
  headBranch: string
  baseBranch: string
  email?: string
  githubAppInstallationId?: number | null
  excludeReposWithoutRequiredBranches?: boolean
}
