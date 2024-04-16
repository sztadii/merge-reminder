import { TRPCError } from '@trpc/server'

import { Database, DatabaseId, UserDatabaseRecord } from '../database'
import { UserCreateRequest, UserResponse, UserUpdateRequest } from '../schemas'
import { DatabaseService } from './database-service'

export class UsersService extends DatabaseService<UserDatabaseRecord> {
  constructor(database: Database) {
    super(database, 'users')

    this.onInit()
  }

  private async onInit() {
    await this.collection.createIndex({ githubId: 1 }, { unique: true })
  }

  async findAll(): Promise<UserResponse[]> {
    const records = await this.collection.find().toArray()
    return records.map(this.mapRecordToResponse)
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
        message: `The user with ID ${id} has been deleted.`
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

  async getByIdWithSensitiveData(userId: string): Promise<UserDatabaseRecord> {
    let record

    try {
      record = await this.collection.findOne({
        _id: new DatabaseId(userId)
      })
    } catch {}

    if (!record) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `The user with ID ${userId} has been deleted.`
      })
    }

    return record
  }

  async create(userData: UserCreateRequest): Promise<UserResponse> {
    try {
      const insertedUser = await this.collection.insertOne({
        _id: new DatabaseId(),
        createdAt: new Date(),
        githubId: userData.githubId,
        role: userData.role,
        headBranch: userData.headBranch,
        baseBranch: userData.baseBranch
      })

      return this.getById(insertedUser.insertedId.toString())
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong during user creation.'
      })
    }
  }

  async updateById(id: string, userData: UserUpdateRequest): Promise<void> {
    try {
      await this.collection.updateOne(
        { _id: new DatabaseId(id) },
        {
          $set: {
            updatedAt: new Date(),
            headBranch: userData.headBranch,
            baseBranch: userData.baseBranch,
            email: userData.email,
            excludeReposWithoutRequiredBranches:
              userData.excludeReposWithoutRequiredBranches
          }
        }
      )
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong during user update.'
      })
    }
  }

  async updateInstallationId(
    id: string,
    installationId: number
  ): Promise<void> {
    try {
      await this.collection.updateOne(
        { _id: new DatabaseId(id) },
        {
          $set: {
            updatedAt: new Date(),
            githubAppInstallationId: installationId
          }
        }
      )
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong during installation id update.'
      })
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.collection.deleteOne({ _id: new DatabaseId(id) })
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong during user delete.'
      })
    }
  }

  protected mapRecordToResponse(user: UserDatabaseRecord): UserResponse {
    return {
      ...super.mapRecordToResponse(user),
      email: user.email,
      headBranch: user.headBranch,
      baseBranch: user.baseBranch,
      hasInstallationId: !!user.githubAppInstallationId,
      excludeReposWithoutRequiredBranches:
        !!user.excludeReposWithoutRequiredBranches
    }
  }
}
