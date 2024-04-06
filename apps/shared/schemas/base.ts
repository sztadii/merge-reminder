import * as z from 'zod'

export const IdSchema = z.string()

export const ResponseSchema = z.object({
  id: IdSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional()
})

export type Response = z.infer<typeof ResponseSchema>

export const EmptyResponseSchema = z.void()

export const UpdateRequestSchema = z.object({
  id: IdSchema
})
