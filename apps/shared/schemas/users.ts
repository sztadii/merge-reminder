import * as z from 'zod'

import { ResponseSchema, UpdateRequestSchema } from './base'

export const UserRoleSchema = z.enum(['ADMIN', 'CLIENT'])
export type UserRole = z.infer<typeof UserRoleSchema>

export const UserResponseSchema = ResponseSchema.extend({
  role: UserRoleSchema,
  email: z.string().email(),
  githubLogin: z.string(),
  githubAccessToken: z.string(),
  githubOrganization: z.string(),
  headBranch: z.string(),
  baseBranch: z.string()
})

export const ReminderSchema = z.string()

export const UsersListResponseSchema = z.array(UserResponseSchema)

export const UserCreateRequestSchema = UserResponseSchema.pick({
  githubLogin: true,
  role: true,
  email: true,
  githubAccessToken: true,
  githubOrganization: true,
  headBranch: true,
  baseBranch: true
})

export const UserUpdateRequestSchema = UpdateRequestSchema.merge(
  UserCreateRequestSchema
)

export type UserResponse = z.infer<typeof UserResponseSchema>
export type Reminder = z.infer<typeof ReminderSchema>
export type UserCreateRequest = z.infer<typeof UserCreateRequestSchema>
export type UserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>
