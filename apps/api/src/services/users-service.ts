import { TRPCError } from '@trpc/server'

import { Database, DatabaseId, UserDatabaseRecord } from '../database'
import { UserCreateRequest, UserResponse, UserUpdateRequest } from '../schemas'
import { DatabaseService } from './database-service'

export class UsersService extends DatabaseService<UserDatabaseRecord> {
  constructor(database: Database) {
    super(database, 'users')
  }

  async getById(id: string): Promise<UserResponse> {
    let record

    try {
      record = await this.collection.findOne({
        _id: new DatabaseId(id)
      })
    } catch {}

    if (!record) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User with id ${id} not found!`
      })
    }

    return this.mapRecordToResponse(record)
  }

  async getByGithubId(githubId: number): Promise<UserResponse> {
    let record

    try {
      record = await this.collection.findOne({
        githubId
      })
    } catch {}

    if (!record) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User with githubId ${githubId} not found!`
      })
    }

    return this.mapRecordToResponse(record)
  }

  async create(userData: UserCreateRequest): Promise<UserResponse> {
    try {
      const insertedUser = await this.collection.insertOne({
        _id: new DatabaseId(),
        createdAt: new Date(),
        githubId: userData.githubId,
        userOrOrganizationName: userData.userOrOrganizationName,
        headBranch: userData.headBranch,
        baseBranch: userData.baseBranch,
        isOrganization: userData.isOrganization
      })

      return this.getById(insertedUser.insertedId.toString())
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong during user create'
      })
    }
  }

  async updateById(
    id: string,
    userData: UserUpdateRequest
  ): Promise<UserResponse> {
    try {
      const user = await this.getById(id)

      await this.collection.updateOne(
        { _id: new DatabaseId(id) },
        {
          $set: {
            updatedAt: new Date(),
            email: userData.email,
            githubAccessToken: userData.githubAccessToken,
            headBranch: userData.headBranch,
            baseBranch: userData.baseBranch
          }
        }
      )

      return this.getById(user.id)
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong during user update'
      })
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.collection.deleteOne({ _id: new DatabaseId(id) })
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong during user delete'
      })
    }
  }

  protected mapRecordToResponse(user: UserDatabaseRecord): UserResponse {
    return {
      ...super.mapRecordToResponse(user),
      githubId: user.githubId,
      userOrOrganizationName: user.userOrOrganizationName,
      email: user.email,
      githubAccessToken: user.githubAccessToken,
      headBranch: user.headBranch,
      baseBranch: user.baseBranch,
      isOrganization: user.isOrganization
    }
  }
}
