import * as z from 'zod'

import { ResponseSchema, UpdateRequestSchema } from './base'

export const ProjectResponseSchema = ResponseSchema.extend({
  name: z.string()
})

export const ProjectsListResponseSchema = z.array(ProjectResponseSchema)

export const ProjectCreateRequestSchema = z.object({
  name: z.string()
})

export const ProjectUpdateRequestSchema = UpdateRequestSchema.merge(
  ProjectCreateRequestSchema
)

export type ProjectResponse = z.infer<typeof ProjectResponseSchema>
export type ProjectCreateRequest = z.infer<typeof ProjectCreateRequestSchema>
export type ProjectUpdateRequest = z.infer<typeof ProjectUpdateRequestSchema>
