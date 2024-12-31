import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Input
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useState } from 'react'

import { FullPage } from '@apps/web/components/full-page'
import { Text } from '@apps/web/components/text'
import { isValidEmail, trimObjectValues } from '@apps/web/helpers'
import { showErrorToast } from '@apps/web/libs/toasts'
import { trpc } from '@apps/web/libs/trpc'
import { routerPaths } from '@apps/web/router'

export function Onboarding() {
  const [isPending, setIsPending] = useState(false)
  const [email, setEmail] = useState('')

  const queryClient = useQueryClient()
  const { mutateAsync: updateEmailMutation } =
    trpc.client.updateCurrentEmail.useMutation()

  const trimmedEmail = trimObjectValues(email)
  const hasCorrectEmail = trimmedEmail.length && isValidEmail(trimmedEmail)

  async function updateEmailValue() {
    if (!hasCorrectEmail) return

    try {
      setIsPending(true)

      await updateEmailMutation({
        email: trimmedEmail
      })

      await queryClient.invalidateQueries(
        getQueryKey(trpc.client.getCurrentUser)
      )

      routerPaths.dashboard.navigate()
    } catch {
      showErrorToast('Something went wrong.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <FullPage>
      <Container textAlign="center">
        <Heading size="lg" mb={4}>
          Welcome
        </Heading>

        <Box mb={8}>
          <Text color="gray.500">
            We need your email in case of important matters.
          </Text>
          <Box>
            <Text fontWeight="bold">We will never spam you!</Text>
          </Box>
        </Box>

        <Flex gap={4}>
          <Input
            value={email || ''}
            placeholder="Type your email..."
            onChange={e => setEmail(e.target.value)}
          />

          <Button
            width="200px"
            isLoading={isPending}
            isDisabled={!hasCorrectEmail}
            onClick={updateEmailValue}
            colorScheme="teal"
          >
            Save
          </Button>
        </Flex>

        <Divider my={8} />

        <Button
          variant="ghost"
          onClick={() => routerPaths.dashboard.navigate()}
        >
          Setup later
        </Button>
      </Container>
    </FullPage>
  )
}
