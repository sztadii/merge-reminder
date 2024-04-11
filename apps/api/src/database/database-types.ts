import { UserResponse } from '../schemas'
import { DatabaseId } from './database-connection'

export type DatabaseRecord = {
  _id: DatabaseId
  createdAt: Date
}

export type UserDatabaseRecord = DatabaseRecord &
  Pick<
    UserResponse,
    | 'userOrOrganizationName'
    | 'email'
    | 'githubAccessToken'
    | 'headBranch'
    | 'baseBranch'
    | 'isOrganization'
    | 'githubId'
    | 'role'
  >
