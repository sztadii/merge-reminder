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
    },
    Button: {
      defaultProps: {
        colorScheme: 'blue'
      }
    },
    Switch: {
      defaultProps: {
        colorScheme: 'blue'
      }
    },
    Card: {
      baseStyle: {
        container: {
          backgroundColor: 'gray.50',
          boxShadow: 'none',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'gray.200',
          _dark: {
            borderColor: 'gray.700',
            backgroundColor: 'gray.700'
          }
        }
      }
    }
  }
})

export function ChakraUIProvider({ children }: { children: ReactNode }) {
  return <Provider theme={theme}>{children}</Provider>
}
