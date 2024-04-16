import { Db, MongoClient } from 'mongodb'

export {
  ObjectId as DatabaseId,
  Collection as DatabaseCollection,
  Db as Database
} from 'mongodb'

let dbClient: MongoClient | null = null
let db: Db | null = null
let isConnected: boolean = false

export async function initDatabase(url?: string): Promise<void> {
  if (!url) {
    throw new Error('The database URL is missing')
  }

  try {
    await connectToDatabase(url)
  } catch {
    process.exit(1)
  } finally {
    // Needed when we use ctrl+c to kill process
    process.on('SIGINT', async () => {
      await closeDatabaseConnection()
      process.exit(0)
    })

    // Needed for tsx watch restart
    process.on('SIGTERM', async () => {
      await closeDatabaseConnection()
      process.exit(0)
    })
  }
}

export function getDatabase(): Db {
  if (!isConnected || !dbClient) {
    throw new Error('No connection to the database')
  }

  return db as Db
}

async function connectToDatabase(url: string): Promise<void> {
  try {
    dbClient = await MongoClient.connect(url)
    db = dbClient.db()
    isConnected = true
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB')
    throw error
  }
}

async function closeDatabaseConnection(): Promise<void> {
  if (dbClient) {
    await dbClient.close()
    isConnected = false

    console.log('MongoDB connection closed')
  }
}
