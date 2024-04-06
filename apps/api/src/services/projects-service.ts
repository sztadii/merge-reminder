import { Database, DatabaseId, ProjectDatabaseRecord } from '../database'
import {
  ProjectCreateRequest,
  ProjectResponse,
  ProjectUpdateRequest
} from '../schemas'
import { DatabaseService } from './database-service'

export class ProjectsService extends DatabaseService<ProjectDatabaseRecord> {
  constructor(database: Database) {
    super(database, 'projects')
  }

  async findAll(): Promise<ProjectResponse[]> {
    const records = await this.collection.find().toArray()

    return records.map(this.mapRecordToResponse)
  }

  async getById(id: ProjectResponse['id']): Promise<ProjectResponse | null> {
    const record = await this.collection.findOne({
      _id: new DatabaseId(id)
    })

    if (!record) return null

    return this.mapRecordToResponse(record)
  }

  async create(project: ProjectCreateRequest): Promise<ProjectResponse> {
    const newProject = {
      _id: new DatabaseId(),
      name: project.name,
      createdAt: new Date()
    }

    await this.collection.insertOne(newProject)

    return this.mapRecordToResponse(newProject)
  }

  async update(project: ProjectUpdateRequest): Promise<ProjectResponse> {
    const projectToUpdate = this.getById(project.id)

    if (!projectToUpdate) {
      throw new Error(`Project with ${project.id} not found!`)
    }

    await this.collection.updateOne(
      { _id: new DatabaseId(project.id) },
      {
        $set: {
          name: project.name,
          updatedAt: new Date()
        }
      }
    )

    return (await this.getById(project.id))!
  }

  async deleteById(id: ProjectResponse['id']): Promise<void> {
    await this.collection.deleteOne({ _id: new DatabaseId(id) })
  }

  protected mapRecordToResponse(
    project: ProjectDatabaseRecord
  ): ProjectResponse {
    return {
      ...super.mapRecordToResponse(project),
      name: project.name
    }
  }
}
