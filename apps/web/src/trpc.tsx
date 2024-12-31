import { HTTPHeaders, TRPCClientErrorLike, httpLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { ReactNode } from 'react'

import type { AppRouter } from '@apps/api/routers'
import { queryClient } from '@apps/web/react-query'
import { storage } from '@apps/web/storage'

import { config } from './config'

export type TRPCError = TRPCClientErrorLike<AppRouter>

export const trpc = createTRPCReact<AppRouter>()

export function TRPCProvider({ children }: { children: ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  )
}

const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: config.trpc.url,
      async headers() {
        const headers: HTTPHeaders = {}

        const token = storage.auth.getToken()

        if (token) {
          headers.authorization = `Bearer ${token}`
        }

        return headers
      }
    })
  ]
})
