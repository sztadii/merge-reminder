import {
  EmptyResponseSchema,
  ProjectCreateRequestSchema,
  ProjectResponseSchema,
  ProjectUpdateRequestSchema,
  ProjectsListResponseSchema
} from '../schemas'
import { ProjectsService } from '../services/projects-service'
import { publicProcedure, router } from '../trpc'

export const projectsRouter = router({
  findAll: publicProcedure.output(ProjectsListResponseSchema).query(opts => {
    const projectsService = new ProjectsService(opts.ctx.database)
    return projectsService.findAll()
  }),
  getById: publicProcedure
    .input(ProjectResponseSchema.shape.id)
    .output(ProjectResponseSchema.nullable())
    .query(opts => {
      const projectsService = new ProjectsService(opts.ctx.database)
      return projectsService.getById(opts.input)
    }),
  create: publicProcedure
    .input(ProjectCreateRequestSchema)
    .output(ProjectResponseSchema)
    .mutation(opts => {
      const projectsService = new ProjectsService(opts.ctx.database)
      return projectsService.create(opts.input)
    }),
  update: publicProcedure
    .input(ProjectUpdateRequestSchema)
    .output(ProjectResponseSchema)
    .mutation(opts => {
      const projectsService = new ProjectsService(opts.ctx.database)
      return projectsService.update(opts.input)
    }),
  deleteById: publicProcedure
    .input(ProjectResponseSchema.shape.id)
    .output(EmptyResponseSchema)
    .mutation(opts => {
      const projectsService = new ProjectsService(opts.ctx.database)
      return projectsService.deleteById(opts.input)
    })
})
