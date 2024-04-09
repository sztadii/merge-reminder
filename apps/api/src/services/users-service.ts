import { Database, DatabaseId, UserDatabaseRecord } from '../database'
import { UserCreateRequest, UserResponse, UserUpdateRequest } from '../schemas'
import { DatabaseService } from './database-service'

export class UsersService extends DatabaseService<UserDatabaseRecord> {
  constructor(database: Database) {
    super(database, 'users')
  }

  async findAll(): Promise<UserResponse[]> {
    try {
      const records = await this.collection.find().toArray()

      return records.map(this.mapRecordToResponse)
    } catch {
      throw new Error('Something went wrong during fetching users')
    }
  }

  async getById(id: UserResponse['id']): Promise<UserResponse> {
    let record

    try {
      record = await this.collection.findOne({
        _id: new DatabaseId(id)
      })
    } catch {}

    if (!record) {
      throw new Error(`User with ${id} not found!`)
    }

    return this.mapRecordToResponse(record)
  }

  async create(userCreateRequest: UserCreateRequest): Promise<UserResponse> {
    try {
      const insertedUser = await this.collection.insertOne({
        _id: new DatabaseId(),
        createdAt: new Date(),
        userOrOrganizationName: userCreateRequest.userOrOrganizationName,
        role: userCreateRequest.role,
        email: userCreateRequest.email,
        githubAccessToken: userCreateRequest.githubAccessToken,
        headBranch: userCreateRequest.headBranch,
        baseBranch: userCreateRequest.baseBranch,
        isOrganization: userCreateRequest.isOrganization
      })

      return this.getById(insertedUser.insertedId.toString())
    } catch (e) {
      throw new Error('Something went wrong during user create')
    }
  }

  async update(userUpdateRequest: UserUpdateRequest): Promise<UserResponse> {
    try {
      const user = await this.getById(userUpdateRequest.id)

      await this.collection.updateOne(
        { _id: new DatabaseId(userUpdateRequest.id) },
        {
          $set: {
            updatedAt: new Date(),
            userOrOrganizationName: userUpdateRequest.userOrOrganizationName,
            email: userUpdateRequest.email,
            role: userUpdateRequest.role,
            githubAccessToken: userUpdateRequest.githubAccessToken,
            headBranch: userUpdateRequest.headBranch,
            baseBranch: userUpdateRequest.baseBranch,
            isOrganization: userUpdateRequest.isOrganization
          }
        }
      )

      return this.getById(user.id)
    } catch {
      throw new Error('Something went wrong during user update')
    }
  }

  async deleteById(id: UserResponse['id']): Promise<void> {
    try {
      await this.collection.deleteOne({ _id: new DatabaseId(id) })
    } catch {
      throw new Error('Something went wrong during user delete')
    }
  }

  protected mapRecordToResponse(user: UserDatabaseRecord): UserResponse {
    return {
      ...super.mapRecordToResponse(user),
      userOrOrganizationName: user.userOrOrganizationName,
      role: user.role,
      email: user.email,
      githubAccessToken: user.githubAccessToken,
      headBranch: user.headBranch,
      baseBranch: user.baseBranch,
      isOrganization: user.isOrganization
    }
  }
}
