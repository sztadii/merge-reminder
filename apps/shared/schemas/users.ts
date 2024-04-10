import * as z from 'zod'

import { ResponseSchema } from './base'

export const UserResponseSchema = ResponseSchema.extend({
  githubId: z.number(),
  githubAccessToken: z.string().optional(),
  userOrOrganizationName: z.string(),
  isOrganization: z.boolean(),
  headBranch: z.string(),
  baseBranch: z.string(),
  email: z.string().email().optional()
})

export const WarningSchema = z.object({
  repo: z.string(),
  commits: z.array(z.string()),
  compareLink: z.string(),
  authors: z.array(z.string()),
  delay: z.string()
})

export const WarningsSchema = z.array(WarningSchema)

export const UserCreateRequestSchema = UserResponseSchema.pick({
  githubId: true,
  userOrOrganizationName: true,
  isOrganization: true,
  headBranch: true,
  baseBranch: true
})

export const UserUpdateRequestSchema = UserResponseSchema.pick({
  githubAccessToken: true,
  userOrOrganizationName: true,
  isOrganization: true,
  headBranch: true,
  baseBranch: true,
  email: true
})

export type UserResponse = z.infer<typeof UserResponseSchema>
export type Warning = z.infer<typeof WarningSchema>
export type UserCreateRequest = z.infer<typeof UserCreateRequestSchema>
export type UserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>
