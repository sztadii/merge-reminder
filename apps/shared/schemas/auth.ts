import * as z from 'zod'

export const LoginRequestSchema = z.object({
  code: z.string()
})

export const LoginResponseSchema = z.object({
  token: z.string(),
  isNewUser: z.boolean(),
  isDeletedUser: z.boolean()
})

export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type LoginRequest = z.infer<typeof LoginRequestSchema>
