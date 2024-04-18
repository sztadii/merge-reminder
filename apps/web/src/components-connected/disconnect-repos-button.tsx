import { Button, useDisclosure } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'

import { Confirmation } from 'src/components/confirmation'
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

  const {
    isOpen: isOpenForConfirmModal,
    onOpen: onOpenForConfirmModal,
    onClose: onCloseForConfirmModal
  } = useDisclosure()

  async function disconnectRepos() {
    if (!user) return

    try {
      await disconnectRepositoriesMutation()
      onCloseForConfirmModal()
      await queryClient.invalidateQueries(
        getQueryKey(trpc.client.getCurrentUser)
      )
      showSuccessToast('Successfully disconnected repositories.')
    } catch {
      showErrorToast('Cannot disconnect repositories.')
    }
  }

  return (
    <>
      <Button
        isDisabled={!user || !user.hasInstallationId}
        isLoading={isLoadingForDisconnecting}
        onClick={onOpenForConfirmModal}
        colorScheme="red"
        width={{
          base: '100%',
          md: '150px'
        }}
      >
        Disconnect
      </Button>

      <Confirmation
        isOpen={isOpenForConfirmModal}
        onClose={onCloseForConfirmModal}
        title="Disconnect repositories"
        description="Do you want to disconnect all your repositories?"
        confirmButton={{
          text: 'Disconnect',
          onClick: disconnectRepos
        }}
      />
    </>
  )
}
