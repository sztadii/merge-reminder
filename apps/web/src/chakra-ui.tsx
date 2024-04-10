import { ChakraProvider as Provider, extendTheme } from '@chakra-ui/react'
import { ReactNode } from 'react'

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

export function ChakraUIProvider({ children }: { children: ReactNode }) {
  return <Provider theme={theme}>{children}</Provider>
}
