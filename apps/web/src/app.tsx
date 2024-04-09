import {
  ChakraProvider,
  defineStyleConfig,
  extendTheme
} from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpLink } from '@trpc/client'

import { Router } from 'src/router'
import { ToastProvider } from 'src/toasts'
import { trpc } from 'src/trpc'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false
    }
  }
})

const trpcURL = process.env.TRPC_URL || 'http://localhost:3000/trpc'

const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: trpcURL
    })
  ]
})

export const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  },
  components: {
    Alert: {
      baseStyle: {
        container: {
          borderRadius: 'md'
        }
      }
    }
  }
})

export function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Router />
          <ToastProvider />
        </ChakraProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}
