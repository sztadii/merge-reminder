import { Box, Button, Flex, Heading } from '@chakra-ui/react'
import { Link } from 'wouter'

import { Text } from 'src/components/text'
import { routerPaths } from 'src/router'

export function Landing() {
  return (
    <Flex
      height="100vh"
      width="100vw"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box>
        <Text color="gray.500">Welcome to</Text>
      </Box>

      <Heading size="md" color="gray.500" mb={4}>
        Merge Reminder
      </Heading>

      <Box position="absolute" right={4} top={4}>
        <Button colorScheme="gray" as={Link} to={routerPaths.dashboard.path}>
          Dashaboard
        </Button>
      </Box>
    </Flex>
  )
}
