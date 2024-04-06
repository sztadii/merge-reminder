import { Database, DatabaseId, UserDatabaseRecord } from '../database'
import { UserRequest, UserResponse } from '../schemas'
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

  async create(userToCreate: UserRequest): Promise<UserResponse> {
    const insertedUser = await this.collection.insertOne({
      _id: new DatabaseId(),
      name: userToCreate.name,
      role: userToCreate.role,
      email: userToCreate.email,
      createdAt: new Date()
    })

    const createdUser = await this.getById(insertedUser.insertedId.toString())

    return createdUser!
  }

  async deleteById(id: UserResponse['id']): Promise<void> {
    await this.collection.deleteOne({ _id: new DatabaseId(id) })
  }

  protected mapRecordToResponse(user: UserDatabaseRecord): UserResponse {
    return {
      ...super.mapRecordToResponse(user),
      name: user.name,
      role: user.role,
      email: user.email
    }
  }
}
