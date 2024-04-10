import { HTTPHeaders, httpLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'

import type { AppRouter } from '../../api'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
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
