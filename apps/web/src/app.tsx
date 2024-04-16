import { ChakraUIProvider } from 'src/chakra-ui'
import { ReactQueryProvider } from 'src/react-query'
import { Router } from 'src/router'
import { ToastProvider } from 'src/toasts'
import { TRPCProvider } from 'src/trpc'

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
