import { Box, Heading } from '@chakra-ui/react'

import { FullPage } from 'src/components/full-page'
import { Text } from 'src/components/text'
import { LoginGithubButton } from 'src/features/buttons/login-github-button'

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
