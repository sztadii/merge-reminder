import * as z from 'zod'

import { ResponseSchema } from './base'

export const UserResponseSchema = ResponseSchema.extend({
  avatarUrl: z.string(),
  email: z.string().email().optional(),
  hasInstallationId: z.boolean()
})

export type UserResponse = z.infer<typeof UserResponseSchema>

export const UserCreateRequestSchema = z.object({
  githubId: z.number(),
  avatarUrl: z.string(),
  role: z.enum(['client', 'admin'])
})

export type UserCreateRequest = z.infer<typeof UserCreateRequestSchema>

export const UserUpdateRequestSchema = z.object({
  email: z.string().email()
})

export type UserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>

export const WarningResponseSchema = z.object({
  repo: z.string(),
  commits: z.array(z.string()),
  compareLink: z.string(),
  authors: z.array(z.string()),
  delay: z.string()
})

export type WarningResponse = z.infer<typeof WarningResponseSchema>

export const WarningsResponseSchema = z.array(WarningResponseSchema)

export const ConnectRepositoriesRequestSchema = z.object({
  installationId: z.number()
})

export const RepositoryResponseSchema = z.object({
  name: z.string(),
  url: z.string()
})

export type RepositoryResponse = z.infer<typeof RepositoryResponseSchema>

export const RepositoriesResponseSchema = z.array(RepositoryResponseSchema)

export const RepoConfigurationResponseSchema = ResponseSchema.extend({
  userId: z.string(),
  headBranch: z.string(),
  baseBranch: z.string(),
  excludeReposWithoutRequiredBranches: z.boolean(),
  repos: z.array(
    z.object({
      repoId: z.number(),
      headBranch: z.string(),
      baseBranch: z.string()
    })
  )
})

export type RepoConfigurationResponse = z.infer<
  typeof RepoConfigurationResponseSchema
>

export const RepoConfigurationCreateRequestSchema = z.object({
  userId: z.string(),
  headBranch: z.string(),
  baseBranch: z.string(),
  excludeReposWithoutRequiredBranches: z.boolean(),
  repos: z.array(
    z.object({
      repoId: z.number(),
      headBranch: z.string(),
      baseBranch: z.string()
    })
  )
})

export type RepoConfigurationCreateRequest = z.infer<
  typeof RepoConfigurationCreateRequestSchema
>

export const RepoConfigurationUpdateRequestSchema = z.object({
  headBranch: z.string().optional(),
  baseBranch: z.string().optional(),
  excludeReposWithoutRequiredBranches: z.boolean().optional(),
  repos: z
    .array(
      z.object({
        repoId: z.number(),
        headBranch: z.string(),
        baseBranch: z.string()
      })
    )
    .optional()
})

export type RepoConfigurationUpdateRequest = z.infer<
  typeof RepoConfigurationUpdateRequestSchema
>
