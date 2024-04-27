import { Box, Flex } from '@chakra-ui/react'
import { ReactNode } from 'react'

type FullPageProps = {
  children: ReactNode
}

export function FullPage({ children }: FullPageProps) {
  return (
    <Flex
      height="100dvh"
      width="100dvw"
      alignItems="center"
      justifyContent="center"
    >
      <Box>{children}</Box>
    </Flex>
  )
}
