import { Container as ChakraContainer } from '@chakra-ui/react'
import { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
}

export function Container({ children }: ContainerProps) {
  return <ChakraContainer maxWidth="1400px">{children}</ChakraContainer>
}
