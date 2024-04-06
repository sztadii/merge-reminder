import * as z from 'zod'

import { ResponseSchema } from './base'

export const UserRoleSchema = z.enum(['ADMIN', 'CLIENT'])
export type UserRole = z.infer<typeof UserRoleSchema>

export const UserResponseSchema = ResponseSchema.extend({
  login: z.string(),
  role: UserRoleSchema,
  email: z.string().email()
})

export const UsersListResponseSchema = z.array(UserResponseSchema)

export const UserRequestSchema = UserResponseSchema.pick({
  login: true,
  role: true,
  email: true
})

export type UserResponse = z.infer<typeof UserResponseSchema>
export type UserRequest = z.infer<typeof UserRequestSchema>
