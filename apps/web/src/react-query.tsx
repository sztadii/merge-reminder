import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { ReactNode } from 'react'

import { routerPaths } from 'src/router'
import { TRPCError } from 'src/trpc'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false
    }
  },
  queryCache: new QueryCache({
    onError: handleError
  }),
  mutationCache: new MutationCache({
    onError: handleError
  })
})

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

function handleError(e: unknown) {
  const error = e as TRPCError

  if (error.data?.code === 'UNAUTHORIZED') {
    routerPaths.login.navigate()
  }
}
