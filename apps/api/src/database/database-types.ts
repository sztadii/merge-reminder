import { ProjectResponse, UserResponse } from '../schemas'
import { DatabaseId } from './database-connection'

export type DatabaseRecord = {
  _id: DatabaseId
  createdAt: Date
}

export type ProjectDatabaseRecord = DatabaseRecord &
  Pick<ProjectResponse, 'name'>

export type UserDatabaseRecord = DatabaseRecord &
  Pick<UserResponse, 'name' | 'role' | 'email'>
