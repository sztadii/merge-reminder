import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { ReactNode } from 'react'

import { logout } from '@apps/web/helpers'
import { showErrorToast } from '@apps/web/libs/toasts'
import { TRPCError } from '@apps/web/libs/trpc'

const fiveMinutes = 1000 * 60 * 5

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 200,
      refetchOnWindowFocus: false,
      staleTime: fiveMinutes
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

  const errorCode = error?.data?.code

  if (errorCode === 'PRECONDITION_FAILED') {
    logout()
    showErrorToast('Server under maintenance. We will back soon.', {
      durationInMilliseconds: 10_000
    })
    return
  }

  if (errorCode === 'UNAUTHORIZED') {
    logout()
    return
  }
}
