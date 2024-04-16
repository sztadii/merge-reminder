import { Database, DatabaseCollection, DatabaseRecord } from '../database'
import { Response } from '../schemas'

export class DatabaseService<T extends DatabaseRecord> {
  protected collection: DatabaseCollection<T>

  constructor(database: Database, collectionName: string) {
    this.collection = database.collection<T>(collectionName)
  }

  protected mapRecordToResponse(record: T): Response {
    return {
      id: record._id.toString(),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt?.toISOString()
    }
  }
}
