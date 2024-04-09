import * as z from 'zod'

import { ResponseSchema, UpdateRequestSchema } from './base'

export const UserRoleSchema = z.enum(['ADMIN', 'CLIENT'])
export type UserRole = z.infer<typeof UserRoleSchema>

export const UserResponseSchema = ResponseSchema.extend({
  role: UserRoleSchema,
  email: z.string().email(),
  userOrOrganizationName: z.string(),
  githubAccessToken: z.string(),
  headBranch: z.string(),
  baseBranch: z.string(),
  isOrganization: z.boolean()
})

export const WarningSchema = z.object({
  repo: z.string(),
  commits: z.array(z.string()),
  authors: z.array(z.string()),
  delayInHours: z.number()
})

export const WarningsSchema = z.array(WarningSchema)

export const UsersListResponseSchema = z.array(UserResponseSchema)

export const UserCreateRequestSchema = UserResponseSchema.pick({
  userOrOrganizationName: true,
  role: true,
  email: true,
  githubAccessToken: true,
  headBranch: true,
  baseBranch: true,
  isOrganization: true
})

export const UserUpdateRequestSchema = UpdateRequestSchema.merge(
  UserCreateRequestSchema
)

export type UserResponse = z.infer<typeof UserResponseSchema>
export type Warning = z.infer<typeof WarningSchema>
export type UserCreateRequest = z.infer<typeof UserCreateRequestSchema>
export type UserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>
