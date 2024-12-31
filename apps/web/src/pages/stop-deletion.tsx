import { Box, Button, Container, Heading } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useState } from 'react'

import { FullPage } from '@apps/web/components/full-page'
import { Text } from '@apps/web/components/text'
import { showErrorToast } from '@apps/web/libs/toasts'
import { trpc } from '@apps/web/libs/trpc'
import { routerPaths } from '@apps/web/router'

export function StopDeletion() {
  const [isPending, setIsPending] = useState(false)

  const queryClient = useQueryClient()
  const { mutateAsync: stopDeletionProcessMutation } =
    trpc.client.stopDeletionProcess.useMutation()

  async function stopDeletionProcess() {
    try {
      setIsPending(true)

      await stopDeletionProcessMutation()

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
          Welcome back
        </Heading>

        <Box mb={8}>
          <Text color="gray.500">
            Do you want to stop profile deletion process?
          </Text>
        </Box>

        <Button
          isLoading={isPending}
          onClick={stopDeletionProcess}
          colorScheme="teal"
        >
          Don't delete profile
        </Button>
      </Container>
    </FullPage>
  )
}
