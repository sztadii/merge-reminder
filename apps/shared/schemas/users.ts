import * as z from 'zod'

import { ResponseSchema, UpdateRequestSchema } from './base'

export const UserRoleSchema = z.enum(['ADMIN', 'CLIENT'])
export type UserRole = z.infer<typeof UserRoleSchema>

export const UserResponseSchema = ResponseSchema.extend({
  role: UserRoleSchema,
  email: z.string().email().optional(),
  userOrOrganizationName: z.string(),
  githubAccessToken: z.string().optional(),
  headBranch: z.string(),
  baseBranch: z.string(),
  isOrganization: z.boolean()
})

export const WarningSchema = z.object({
  repo: z.string(),
  commits: z.array(z.string()),
  compareLink: z.string(),
  authors: z.array(z.string()),
  delay: z.string()
})

export const WarningsSchema = z.array(WarningSchema)

export const UsersListResponseSchema = z.array(UserResponseSchema)

export const UserCreateRequestSchema = UserResponseSchema.pick({
  id: true,
  userOrOrganizationName: true,
  role: true,
  email: true,
  headBranch: true,
  baseBranch: true,
  isOrganization: true
})

export const UserUpdateRequestSchema = UpdateRequestSchema.merge(
  UserResponseSchema.pick({
    id: true,
    userOrOrganizationName: true,
    githubAccessToken: true,
    role: true,
    email: true,
    headBranch: true,
    baseBranch: true,
    isOrganization: true
  })
)

export type UserResponse = z.infer<typeof UserResponseSchema>
export type Warning = z.infer<typeof WarningSchema>
export type UserCreateRequest = z.infer<typeof UserCreateRequestSchema>
export type UserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>
