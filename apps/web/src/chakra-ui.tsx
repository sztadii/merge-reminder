import { ChakraProvider as Provider, extendTheme } from '@chakra-ui/react'
import { ReactNode } from 'react'

export const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  },
  components: {
    Switch: {
      defaultProps: {
        colorScheme: 'teal'
      }
    },
    Alert: {
      baseStyle: {
        container: {
          borderRadius: 'md'
        }
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
            borderColor: 'whiteAlpha.200',
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
