import { HTTPHeaders, TRPCClientErrorLike, httpLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { ReactNode } from 'react'

import type { AppRouter } from '../../api'
import { queryClient } from './react-query'

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
      url: process.env.TRPC_URL || 'http://localhost:3000/trpc',
      async headers() {
        const headers: HTTPHeaders = {}

        const token = localStorage.getItem('token')

        if (token) {
          headers.authorization = `Bearer ${token}`
        }

        return headers
      }
    })
  ]
})
