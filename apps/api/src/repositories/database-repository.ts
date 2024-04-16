import { Database, DatabaseCollection, DatabaseRecord } from '../database'

export class DatabaseRepository<T extends DatabaseRecord> {
  protected collection: DatabaseCollection<T>

  constructor(database: Database, collectionName: string) {
    this.collection = database.collection<T>(collectionName)
  }
}
