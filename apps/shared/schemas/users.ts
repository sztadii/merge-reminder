import * as z from 'zod'

import { ResponseSchema } from './base'

export const UserResponseSchema = ResponseSchema.extend({
  email: z.string().email().optional(),
  userOrOrganizationName: z.string(),
  githubId: z.number(),
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

export const UserCreateRequestSchema = UserResponseSchema.pick({
  githubId: true,
  userOrOrganizationName: true,
  isOrganization: true,
  headBranch: true,
  baseBranch: true
})

export const UserUpdateRequestSchema = UserResponseSchema.pick({
  email: true,
  githubAccessToken: true,
  headBranch: true,
  baseBranch: true
})

export type UserResponse = z.infer<typeof UserResponseSchema>
export type Warning = z.infer<typeof WarningSchema>
export type UserCreateRequest = z.infer<typeof UserCreateRequestSchema>
export type UserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>
