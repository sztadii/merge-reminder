import * as z from 'zod'

import { ResponseSchema } from './base'

export const UserResponseSchema = ResponseSchema.extend({
  headBranch: z.string(),
  baseBranch: z.string(),
  email: z.string().email().optional(),
  hasInstallationId: z.boolean(),
  excludeReposWithoutRequiredBranches: z.boolean()
})

export const WarningResponseSchema = z.object({
  repo: z.string(),
  commits: z.array(z.string()),
  compareLink: z.string(),
  authors: z.array(z.string()),
  delay: z.string()
})

export const WarningsResponseSchema = z.array(WarningResponseSchema)

export const UserCreateRequestSchema = z.object({
  githubId: z.number(),
  role: z.enum(['client', 'admin']),
  headBranch: z.string(),
  baseBranch: z.string()
})

export const UserUpdateRequestSchema = z.object({
  headBranch: z.string(),
  baseBranch: z.string(),
  email: z.string().email(),
  excludeReposWithoutRequiredBranches: z.boolean()
})

export const InstallationIdUpdateRequestSchema = z.object({
  installationId: z.number()
})

export type UserResponse = z.infer<typeof UserResponseSchema>
export type WarningResponse = z.infer<typeof WarningResponseSchema>
export type UserCreateRequest = z.infer<typeof UserCreateRequestSchema>
export type UserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>
