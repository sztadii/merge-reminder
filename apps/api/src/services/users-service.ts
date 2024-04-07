import { Database, DatabaseId, UserDatabaseRecord } from '../database'
import { UserCreateRequest, UserResponse, UserUpdateRequest } from '../schemas'
import { DatabaseService } from './database-service'

export class UsersService extends DatabaseService<UserDatabaseRecord> {
  constructor(database: Database) {
    super(database, 'users')
  }

  async findAll(): Promise<UserResponse[]> {
    const records = await this.collection.find().toArray()

    return records.map(this.mapRecordToResponse)
  }

  async getById(id: UserResponse['id']): Promise<UserResponse> {
    const record = await this.collection.findOne({
      _id: new DatabaseId(id)
    })

    if (!record) {
      throw new Error(`User with ${id} not found!`)
    }

    return this.mapRecordToResponse(record)
  }

  async create(userCreateRequest: UserCreateRequest): Promise<UserResponse> {
    const insertedUser = await this.collection.insertOne({
      _id: new DatabaseId(),
      createdAt: new Date(),
      login: userCreateRequest.login,
      role: userCreateRequest.role,
      email: userCreateRequest.email,
      githubAccessToken: userCreateRequest.githubAccessToken,
      githubOrganization: userCreateRequest.githubOrganization,
      headBranch: userCreateRequest.headBranch,
      baseBranch: userCreateRequest.baseBranch
    })

    return this.getById(insertedUser.insertedId.toString())
  }

  async update(userUpdateRequest: UserUpdateRequest): Promise<UserResponse> {
    const user = await this.getById(userUpdateRequest.id)

    await this.collection.updateOne(
      { _id: new DatabaseId(userUpdateRequest.id) },
      {
        $set: {
          updatedAt: new Date(),
          login: userUpdateRequest.login,
          email: userUpdateRequest.email,
          role: userUpdateRequest.role,
          githubAccessToken: userUpdateRequest.githubAccessToken,
          githubOrganization: userUpdateRequest.githubAccessToken,
          headBranch: userUpdateRequest.headBranch,
          baseBranch: userUpdateRequest.baseBranch
        }
      }
    )

    return this.getById(user.id)
  }

  async deleteById(id: UserResponse['id']): Promise<void> {
    await this.collection.deleteOne({ _id: new DatabaseId(id) })
  }

  protected mapRecordToResponse(user: UserDatabaseRecord): UserResponse {
    return {
      ...super.mapRecordToResponse(user),
      login: user.login,
      role: user.role,
      email: user.email,
      githubAccessToken: user.githubAccessToken,
      githubOrganization: user.githubOrganization,
      headBranch: user.headBranch,
      baseBranch: user.baseBranch
    }
  }
}
