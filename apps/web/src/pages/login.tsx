import { Box, Flex, Heading } from '@chakra-ui/react'

import { LoginGithubButton } from 'src/components-connected/buttons/login-github-button'
import { Text } from 'src/components/text'

export function Login() {
  return (
    <Flex
      height="100dvh"
      width="100dvw"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box>
        <Text color="gray.500">Welcome to</Text>
      </Box>

      <Heading size="md" color="gray.500">
        Merge Reminder
      </Heading>

      <Box mt={4}>
        <LoginGithubButton />
      </Box>
    </Flex>
  )
}
