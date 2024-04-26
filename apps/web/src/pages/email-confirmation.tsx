import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Heading,
  Skeleton
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useEffect, useState } from 'react'

import { routerPaths } from 'src/router'
import { trpc } from 'src/trpc'

export function EmailConfirmation() {
  const [message, setMessage] = useState<{
    text: string
    status: 'error' | 'success'
  }>()

  const queryClient = useQueryClient()

  const { mutateAsync: confirmEmail } = trpc.client.confirmEmail.useMutation()
  const params = routerPaths.emailConfirmation.useParams()

  useEffect(() => {
    async function confirm() {
      try {
        await confirmEmail({
          token: params.token
        })

        await queryClient.invalidateQueries(
          getQueryKey(trpc.client.getCurrentUser)
        )

        setMessage({
          status: 'success',
          text: 'Your email is confirmed'
        })
      } catch {
        setMessage({
          status: 'error',
          text: 'Something went wrong during confirmation'
        })
      }
    }

    confirm()
  }, [])

  return (
    <Container>
      <Box textAlign="center">
        <Heading>Welcome back :)</Heading>

        <Box mt={4}>
          <Skeleton isLoaded={!!message}>
            <Alert status={message?.status}>
              <AlertIcon />
              {message?.text}
            </Alert>
          </Skeleton>
        </Box>

        <Box mt={4}>
          <Skeleton display="inline-block" isLoaded={!!message}>
            <Button
              onClick={() => {
                routerPaths.dashboard.navigate()
              }}
            >
              Go to dashboard
            </Button>
          </Skeleton>
        </Box>
      </Box>
    </Container>
  )
}
