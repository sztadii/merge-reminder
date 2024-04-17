import {
  Database,
  DatabaseId,
  UserDatabaseRecord,
  UserDatabaseValues
} from '../database'
import { DatabaseRepository } from './database-repository'

export class UsersRepository extends DatabaseRepository<UserDatabaseRecord> {
  constructor(database: Database) {
    super(database, 'users')

    this.onInit()
  }

  private async onInit() {
    await this.collection.createIndex({ githubId: 1 }, { unique: true })
  }

  findAll(): Promise<UserDatabaseRecord[]> {
    return this.collection.find().toArray()
  }

  getById(id: string): Promise<UserDatabaseRecord | null> {
    return this.collection.findOne({
      _id: new DatabaseId(id)
    })
  }

  getByGithubId(githubId: number): Promise<UserDatabaseRecord | null> {
    return this.collection.findOne({
      githubId
    })
  }

  async create(data: UserDatabaseValues): Promise<UserDatabaseRecord> {
    const inserted = await this.collection.insertOne({
      ...data,
      _id: new DatabaseId(),
      createdAt: new Date()
    })

    const record = await this.getById(inserted.insertedId.toString())
    return record!
  }

  async updateById(
    id: string,
    data: Partial<UserDatabaseValues>
  ): Promise<void> {
    await this.collection.updateOne(
      { _id: new DatabaseId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date()
        }
      }
    )
  }

  async deleteById(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: new DatabaseId(id) })
  }
}
