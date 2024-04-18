import { Button } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'

import { UserResponse } from 'src/schemas'
import { showErrorToast, showSuccessToast } from 'src/toasts'
import { trpc } from 'src/trpc'

type DisconnectReposButtonProps = {
  user?: UserResponse
}

export function DisconnectReposButton({ user }: DisconnectReposButtonProps) {
  const {
    mutateAsync: disconnectRepositoriesMutation,
    isLoading: isLoadingForDisconnecting
  } = trpc.client.disconnectRepositories.useMutation()

  const queryClient = useQueryClient()

  return (
    <>
      <Button
        isDisabled={!user || !user.hasInstallationId}
        isLoading={isLoadingForDisconnecting}
        onClick={async () => {
          try {
            await disconnectRepositoriesMutation()
            await queryClient.invalidateQueries(
              getQueryKey(trpc.client.getCurrentUser)
            )
            showSuccessToast('Successfully disconnected repositories.')
          } catch {
            showErrorToast('Cannot disconnect repositories.')
          }
        }}
        colorScheme="red"
      >
        Disconnect
      </Button>
    </>
  )
}
