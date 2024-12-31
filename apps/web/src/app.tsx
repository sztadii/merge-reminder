import { ChakraUIProvider } from '@apps/web/libs/chakra-ui'
import { ReactQueryProvider } from '@apps/web/libs/react-query'
import { ToastProvider } from '@apps/web/libs/toasts'
import { TRPCProvider } from '@apps/web/libs/trpc'
import { Router } from '@apps/web/router'

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
