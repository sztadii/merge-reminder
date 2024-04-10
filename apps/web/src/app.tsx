import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Router } from 'src/router'
import { ToastProvider } from 'src/toasts'
import { trpc, trpcClient } from 'src/trpc'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false
    }
  }
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
