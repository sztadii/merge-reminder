import { ChakraUIProvider } from '@apps/web/chakra-ui'
import { ReactQueryProvider } from '@apps/web/react-query'
import { Router } from '@apps/web/router'
import { ToastProvider } from '@apps/web/toasts'
import { TRPCProvider } from '@apps/web/trpc'

export function App() {
  return (
    <TRPCProvider>
      <ReactQueryProvider>
        <ChakraUIProvider>
          <Router />
          <ToastProvider />
        </ChakraUIProvider>
      </ReactQueryProvider>
    </TRPCProvider>
  )
}
