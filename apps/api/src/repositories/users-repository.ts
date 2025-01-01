import { differenceInDays } from 'date-fns'

import { config } from '@apps/api/config'
import {
  Database,
  DatabaseId,
  UserDatabaseRecord,
  UserDatabaseValues
} from '@apps/api/database'

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

  getById(userId: string): Promise<UserDatabaseRecord | null> {
    return this.collection.findOne({
      _id: new DatabaseId(userId)
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
    userId: string,
    data: Partial<UserDatabaseValues>
  ): Promise<void> {
    await this.collection.updateOne(
      { _id: new DatabaseId(userId) },
      {
        $set: {
          ...data,
          updatedAt: new Date()
        }
      }
    )
  }

  async deleteById(userId: string): Promise<void> {
    await this.updateById(userId, {
      githubAccessToken: null,
      deletedDate: new Date()
    })
  }

  async getUserSubscriptionInfo(userId: string) {
    const user = await this.getById(userId)
    if (!user) return null

    const isStripeInvoicePaid = false

    const today = new Date()
    const daysSinceCreation = differenceInDays(today, user.createdAt)
    const countOfFreeTrialDays =
      config.app.freeTrialLengthInDays - daysSinceCreation
    const isActiveFreeTrial = countOfFreeTrialDays > 0

    const isActiveSubscription = isActiveFreeTrial || isStripeInvoicePaid

    return {
      isActiveSubscription,
      isActiveFreeTrial,
      countOfFreeTrialDays
    }
  }
}
