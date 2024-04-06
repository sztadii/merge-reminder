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

  async getById(id: UserResponse['id']): Promise<UserResponse | null> {
    const record = await this.collection.findOne({
      _id: new DatabaseId(id)
    })

    if (!record) return null

    return this.mapRecordToResponse(record)
  }

  async create(userCreateRequest: UserCreateRequest): Promise<UserResponse> {
    const insertedUser = await this.collection.insertOne({
      _id: new DatabaseId(),
      login: userCreateRequest.login,
      role: userCreateRequest.role,
      email: userCreateRequest.email,
      createdAt: new Date()
    })

    const createdUser = await this.getById(insertedUser.insertedId.toString())

    return createdUser!
  }

  async update(userUpdateRequest: UserUpdateRequest): Promise<UserResponse> {
    const user = await this.getById(userUpdateRequest.id)

    if (!user) {
      throw new Error(`User with ${userUpdateRequest.id} not found!`)
    }

    await this.collection.updateOne(
      { _id: new DatabaseId(userUpdateRequest.id) },
      {
        $set: {
          login: userUpdateRequest.login,
          email: userUpdateRequest.email,
          role: userUpdateRequest.role,
          updatedAt: new Date()
        }
      }
    )

    return (await this.getById(user.id))!
  }

  async deleteById(id: UserResponse['id']): Promise<void> {
    await this.collection.deleteOne({ _id: new DatabaseId(id) })
  }

  protected mapRecordToResponse(user: UserDatabaseRecord): UserResponse {
    return {
      ...super.mapRecordToResponse(user),
      login: user.login,
      role: user.role,
      email: user.email
    }
  }
}
