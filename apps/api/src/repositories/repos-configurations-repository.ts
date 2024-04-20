import {
  Database,
  DatabaseId,
  ReposConfigurationDatabaseValues,
  ReposConfigurationRecord
} from '../database'
import { DatabaseRepository } from './database-repository'

export class ReposConfigurationsRepository extends DatabaseRepository<ReposConfigurationRecord> {
  constructor(database: Database) {
    super(database, 'repos-configurations')

    this.onInit()
  }

  private async onInit() {
    await this.collection.createIndex({ userId: 1 }, { unique: true })
  }

  getById(id: string): Promise<ReposConfigurationRecord | null> {
    return this.collection.findOne({
      _id: new DatabaseId(id)
    })
  }

  getByUserId(userId: string): Promise<ReposConfigurationRecord | null> {
    return this.collection.findOne({
      userId
    })
  }

  async create(
    data: ReposConfigurationDatabaseValues
  ): Promise<ReposConfigurationRecord> {
    const inserted = await this.collection.insertOne({
      ...data,
      _id: new DatabaseId(),
      createdAt: new Date()
    })

    const record = await this.getById(inserted.insertedId.toString())
    return record!
  }

  async updateByUserId(
    userId: string,
    data: Partial<ReposConfigurationDatabaseValues>
  ): Promise<void> {
    await this.collection.updateOne(
      { userId },
      {
        $set: {
          ...data,
          updatedAt: new Date()
        }
      }
    )
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.collection.deleteOne({ userId })
  }
}
