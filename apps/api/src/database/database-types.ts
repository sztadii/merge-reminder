import { UserResponse } from '../schemas'
import { DatabaseId } from './database-connection'

export type DatabaseRecord = {
  _id: DatabaseId
  createdAt: Date
  updatedAt?: Date
}

export type UserDatabaseRecord = DatabaseRecord & {
  githubId: number
  role: 'admin' | 'client'
  email?: string
  githubAccessToken?: string
  userOrOrganizationName: string
  isOrganization: boolean
  headBranch: string
  baseBranch: string
}
