import * as z from 'zod'

import { ResponseSchema } from './base'

export const UserRoleSchema = z.enum(['ADMIN', 'MODERATOR', 'TRANSLATOR'])
export type UserRole = z.infer<typeof UserRoleSchema>

export const UserResponseSchema = ResponseSchema.extend({
  name: z.string(),
  role: UserRoleSchema,
  email: z.string().email()
})

export const UsersListResponseSchema = z.array(UserResponseSchema)

export const UserRequestSchema = UserResponseSchema.pick({
  name: true,
  role: true,
  email: true
})

export type UserResponse = z.infer<typeof UserResponseSchema>
export type UserRequest = z.infer<typeof UserRequestSchema>
