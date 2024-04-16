import { Box, Heading } from '@chakra-ui/react'

import { LoginGithubButton } from 'src/components-connected/buttons/login-github-button'
import { FullPage } from 'src/components/full-page'
import { Text } from 'src/components/text'

export function Login() {
  return (
    <FullPage>
      <Box textAlign="center">
        <Box>
          <Text color="gray.500">Welcome to</Text>
        </Box>

        <Heading size="md" color="gray.500">
          Merge Reminder
        </Heading>

        <Box mt={4}>
          <LoginGithubButton />
        </Box>
      </Box>
    </FullPage>
  )
}
