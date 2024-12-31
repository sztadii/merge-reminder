import {
  Alert,
  AlertIcon,
  Box,
  Container,
  Heading,
  Skeleton
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useEffect, useState } from 'react'

import { FullPage } from '@apps/web/components/full-page'
import { trpc } from '@apps/web/libs/trpc'
import { routerPaths } from '@apps/web/router'

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
    <FullPage>
      <Container textAlign="center">
        <Skeleton display="inline-block" isLoaded={!!message}>
          <Heading>Welcome back</Heading>
        </Skeleton>

        <Box mt={4}>
          <Skeleton isLoaded={!!message}>
            <Alert status={message?.status}>
              <AlertIcon />
              {message?.text}
            </Alert>
          </Skeleton>
        </Box>
      </Container>
    </FullPage>
  )
}
