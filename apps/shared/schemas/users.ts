import * as z from 'zod'

import { ResponseSchema } from './base'

export const UserResponseSchema = ResponseSchema.extend({
  githubId: z.number(),
  githubAccessToken: z.string().optional(),
  userOrOrganizationName: z.string(),
  isOrganization: z.boolean(),
  headBranch: z.string(),
  baseBranch: z.string(),
  email: z.string().email().optional(),
  role: z.enum(['client', 'admin'])
})

export const WarningResponseSchema = z.object({
  repo: z.string(),
  commits: z.array(z.string()),
  compareLink: z.string(),
  authors: z.array(z.string()),
  delay: z.string()
})

export const WarningsResponseSchema = z.array(WarningResponseSchema)

export const UserCreateRequestSchema = UserResponseSchema.pick({
  role: true,
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
export type WarningResponse = z.infer<typeof WarningResponseSchema>
export type UserCreateRequest = z.infer<typeof UserCreateRequestSchema>
export type UserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>
